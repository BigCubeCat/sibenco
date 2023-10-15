import { I_RouterDocument } from "../../models/route.model";
export function filterRoutesWithStatus(routes: I_RouterDocument[]) {
  let routesWithGoodStatus = [];
  for (let i = 0; i < routes.length; i++) {
    if (routes[i].status == "merged" || routes[i].isSingle == true || routes[i].isPrivate == true) {
      continue;
    }
    routesWithGoodStatus.push(routes[i]);
  }
  return routesWithGoodStatus;
}
