import {d1SchemaReadiness} from "../../../_lib/d1-readiness.mjs";

const json=(value,status=200)=>new Response(JSON.stringify(value),{
  status,
  headers:{
    "content-type":"application/json; charset=utf-8",
    "cache-control":"no-store",
    "x-content-type-options":"nosniff"
  }
});

export async function onRequestGet(context){
  const readiness=await d1SchemaReadiness(context.env||{});
  return json(readiness,readiness.queryState==="QUERY_FAILED"?503:200);
}
