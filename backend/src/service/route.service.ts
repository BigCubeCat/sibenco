import { convertIntoBoxes } from '../geocoder';
import RouteModel, {IRouteDoc, I_RouterDocument} from '../models/route.model';
import { getNearestInBoxesRoutes } from '../utils/routes_filter/routes_by_boxes';
import { getNearestInTimeRoutes } from '../utils/routes_filter/routes_by_time';

export async function createRoute(route: I_RouterDocument) {
  route.route.boxes = await convertIntoBoxes(route);
  return await RouteModel.create(route);
}

export async function patchRoute(id: string, route: I_RouterDocument) {
  return await RouteModel.findOneAndUpdate({_id: id}, route);
}

export async function deleteRoute(id: string) {
  await RouteModel.findByIdAndRemove(id);
}

export async function getRoute(id: string): Promise<I_RouterDocument | null | undefined> {
  return await RouteModel.findOne({_id: id});
}

export async function getAll(page: number, page_size: number) {
  const allRoutes = await RouteModel.find()
    .sort({_id: -1})
    .skip(page * page_size)
    .limit(page_size);
  if (!allRoutes) {
    throw new Error('not found');
  }
  return allRoutes;
}

export async function merge(routeIds: string[]) {
  const firstRoute = await getRoute(routeIds[0]);
  if (!firstRoute) {
    throw new Error("Bad route Id");
  }
  const newRoute: IRouteDoc = {
    car: firstRoute.car,
    date: firstRoute.date,
    status: "built",
    route: firstRoute.route,
  };

  const newOrders: Set<string> = new Set(firstRoute?.route.orders);
  const newBoxes: Set<string> = new Set(firstRoute?.route.boxes);
  for (let i = 1; i < routeIds.length; ++i) {
    const route = await getRoute(routeIds[i]);
    if (!route) {
      continue;
    }
    route.route.boxes.forEach((box) => newBoxes.add(box));
    route.route.orders.forEach((order) => newOrders.add(order));
    route.status = 'merged';
    await patchRoute(route._id, route);
  }
  newRoute.route.boxes = Array.from(newBoxes);
  newRoute.route.orders = Array.from(newOrders);
  return await createRoute(<I_RouterDocument>newRoute);
}

export async function findSimilarRoutes(id: string) {
  const route = await getRoute(id);
  if (route !== null) {
    let similarRoutes = await getNearestInTimeRoutes(route);
    if (similarRoutes === null) {
      return [];
    }
    similarRoutes = await getNearestInBoxesRoutes(similarRoutes);
    return similarRoutes;
  }
  return [];
}
