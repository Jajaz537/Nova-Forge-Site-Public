import test from "node:test";
import assert from "node:assert/strict";
import {pruneCompiledCss} from "../css-cascade-prune.mjs";

test("removes same-context superseded declaration and its empty rule",()=>{
  const source=".panel{padding:12px}.panel{padding:16px}";
  const after=pruneCompiledCss(source);
  assert.equal(after.css,".panel{padding:16px}");
  assert.equal(after.removed,1);
  assert.equal(after.emptyRulesRemoved,1);
});

test("selector group order is not significant when all selectors match",()=>{
  const after=pruneCompiledCss(".alpha,.beta{opacity:.5}.beta,.alpha{opacity:1}");
  assert.equal(after.css,".beta,.alpha{opacity:1}");
  assert.equal(after.removed,1);
});

test("different media contexts do not supersede each other",()=>{
  const source="@media (max-width:900px){.item{padding:12px}}@media (min-width:901px){.item{padding:16px}}";
  assert.equal(pruneCompiledCss(source).css,source);
});

test("CSS variable fallback declarations are preserved",()=>{
  const source=".card{color:var(--brand,#fff)}.card{color:blue}";
  const result=pruneCompiledCss(source);
  assert.equal(result.css,source);
  assert.equal(result.removed,0);
});

test("supports rules and keyframes retain their original contents",()=>{
  const source="@supports(display:grid){.grid{display:grid}.grid{display:flex}}@keyframes slide{from{transform:translateX(0)}to{transform:translateX(10px)}}";
  assert.equal(pruneCompiledCss(source).css,source);
});

test("important declaration cannot be superseded by non-important",()=>{
  const source=".x{opacity:.5!important}.x{opacity:1}";
  assert.equal(pruneCompiledCss(source).css,source);
});

test("optimization is deterministic and idempotent",()=>{
  const source=".x{color:red}.x{color:blue}@media (max-width:900px){.y{margin:0}.y{margin:10px}}";
  const once=pruneCompiledCss(source).css;
  assert.equal(pruneCompiledCss(once).css,once);
});
