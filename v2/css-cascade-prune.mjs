// Conservative CSS deduplication on the minified Vite bundle only.
// The same selector + media context must have a later supported declaration
// of equal/higher priority. Never remove CSS variables, at-layer, keyframes,
// dynamic values or rules in differing @supports contexts.
import postcss from "postcss";
import {gzipSync} from "node:zlib";

const plainProperty=/^(?:color|background-color|display|position|visibility|opacity|width|height|min-width|max-width|min-height|max-height|margin(?:-(?:top|right|bottom|left|inline|block))?|padding(?:-(?:top|right|bottom|left|inline|block))?|gap|row-gap|column-gap|align-items|justify-content|flex(?:-direction|-wrap|-grow|-shrink|-basis)?|grid-template-(?:columns|rows)|overflow(?:-x|-y)?|border(?:-(?:width|style|color|radius|top|right|bottom|left)(?:-(?:width|style|color))?)?|box-shadow|text-shadow|font-size|font-weight|line-height|letter-spacing|top|right|bottom|left|z-index|transform|filter|text-align)$/;
function safeValue(value){
  return value.length<160 &&
    !/(?:var|env|attr|url|color-mix|calc|clamp|min|max|revert|inherit|initial|unset|currentColor)\s*\(/i.test(value) &&
    !/(?:^|[\s(])(?:revert|inherit|initial|unset|revert-layer)(?:[\s)]|$)/i.test(value) &&
    !/[{}]/.test(value);
}
function equivalentSelectorKey(selector){
  const normalized=selector.trim().replace(/\s+/g," ");
  // Comma-separated selector groups have no ordering semantics. Avoid function
  // arguments, attribute selectors and quoted strings: commas there are syntax.
  if(/[\[\]()"']/.test(normalized))return normalized;
  return normalized.split(",").map(part=>part.trim())
    .filter(Boolean).sort().join(",");
}
function mediaContext(decl){
  if(decl.parent?.type!=="rule")return null;
  const rule=decl.parent;
  const selector=rule.selector ? equivalentSelectorKey(rule.selector) : "";
  if(!selector)return null;
  const outer=[];
  for(let parent=rule.parent;parent&&parent.type!=="root";parent=parent.parent){
    if(parent.type!=="atrule"||parent.name!=="media")return null;
    outer.push("@media "+parent.params.trim().replace(/\s+/g," "));
  }
  return outer.reverse().join("||")+"||"+selector;
}
export function pruneCompiledCss(input){
  const root=postcss.parse(input);
  const buckets=new Map();
  root.walkDecls(decl=>{
    const ctx=mediaContext(decl);
    if(!ctx||!plainProperty.test(decl.prop)||!safeValue(decl.value))return;
    const key=ctx+"||"+decl.prop.toLowerCase();
    const values=buckets.get(key)||[];
    values.push(decl);buckets.set(key,values);
  });
  let removed=0;
  for(const decls of buckets.values()){
    for(let i=0;i<decls.length-1;i++){
      const earlier=decls[i];
      const superseded=decls.slice(i+1).some(later=>
        (!earlier.important||later.important)&&safeValue(later.value)
      );
      if(superseded){earlier.remove();removed++}
    }
  }
  // Removing declarations can leave empty rules; these have no computed-style
  // effects but inflate the delivered CSS. Keep non-empty keyframe and @rules.
  let emptyRulesRemoved=0;
  root.walkRules(rule=>{
    if(rule.nodes?.length===0){rule.remove();emptyRulesRemoved++}
  });
  root.walkAtRules(at=>{
    if(at.nodes?.length===0 && /^(?:media|supports|container|layer)$/i.test(at.name)){
      at.remove();emptyRulesRemoved++;
    }
  });
  // Coalesce ONLY adjacent siblings: crossing any intervening declaration,
  // selector, @supports, @container, or @layer could change the cascade.
  // Moving adjacent identical @media blocks preserves their relative rule order.
  let coalescedPairs=0;
  const coalesceParent=parent=>{
    if(!parent.nodes)return;
    for(const child of [...parent.nodes])coalesceParent(child);
    let i=0;
    while(i<parent.nodes.length-1){
      const first=parent.nodes[i],second=parent.nodes[i+1];
      if(first.type==="atrule"&&second.type==="atrule"&&
         first.name==="media"&&second.name==="media"&&
         first.params===second.params&&first.nodes&&second.nodes){
        first.append(...second.nodes.map(node=>node.clone()));
        second.remove();coalescedPairs++;
        coalesceParent(first);
        continue;
      }
      if(first.type==="rule"&&second.type==="rule"){
        if(first.selector===second.selector){
          first.append(...second.nodes.map(node=>node.clone()));
          second.remove();coalescedPairs++;continue;
        }
        const fingerprint=rule=>rule.nodes?.length>0 &&
          rule.nodes.every(node=>node.type==="decl") ?
          rule.nodes.map(node=>node.prop+"\u0001"+node.value+"\u0001"+(node.important?"!":"")).join("\u0002") : null;
        const left=fingerprint(first),right=fingerprint(second);
        if(left!==null&&left===right){
          first.selector=first.selector+","+second.selector;
          second.remove();coalescedPairs++;continue;
        }
      }
      i++;
    }
  };
  const baseline=root.toString();
  coalesceParent(root);
  const merged=root.toString();
  // String/gzip compression can regress after grouping selectors. Keep the
  // smaller version; never sacrifice bundle size just for a merge count.
  const compressedSize=css=>gzipSync(Buffer.from(css),{level:9}).length;
  const keepMerged=compressedSize(merged)<compressedSize(baseline);
  return {
    css:keepMerged?merged:baseline,
    removed,emptyRulesRemoved,coalescedPairs:keepMerged?coalescedPairs:0,
    coalescenceGzipSaving:keepMerged?compressedSize(baseline)-compressedSize(merged):0
  };

}
