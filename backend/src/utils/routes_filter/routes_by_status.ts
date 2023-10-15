import { I_RouterDocument } from "../../models/route.model";
export function filterRoutesWithStatus(routes: I_RouterDocument[], routeId: string) {
  let routesWithGoodStatus = [];
  for (let i = 0; i < routes.length; i++) {
    if ((routes[i].status == "merged" || routes[i].isSingle == true || routes[i].isPrivate == true) && routes[i]._id != routeId) {
      continue;
    }
    routesWithGoodStatus.push(routes[i]);
  }
  return routesWithGoodStatus;
}
