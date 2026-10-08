import {json} from "../../../_lib/api-security.mjs";
import {productionReadinessState} from "../../../_lib/production-readiness.mjs";

export async function onRequestGet(context){
  return json(await productionReadinessState(context.env||{}));
}
