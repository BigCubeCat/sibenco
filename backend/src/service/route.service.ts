import { convertIntoBoxes } from '../geocoder';
import RouteModel, {I_RouterDocument} from '../models/route.model';
import errors from '../properties/errors';
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

export async function getRoute(id: string) {
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
  const resultRoute = await getRoute(routeIds[0]);
  const newOrders: Set<string> = new Set(resultRoute?.route.orders);
  const newBoxes: Set<string> = new Set(resultRoute?.route.boxes);
  for (let i = 1; i < routeIds.length; ++i) {
    const route = await getRoute(routeIds[i]);
    if (!route) {
      continue;
    }
    route.route.boxes.forEach((box) => newBoxes.add(box));
    route.route.orders.forEach((order) => newOrders.add(order));
    route.status = 'merged';
    patchRoute(route._id, route);
  }
  if (resultRoute) {
    resultRoute.route.orders = Array.from(newOrders);
    resultRoute.route.boxes = Array.from(newBoxes);
    resultRoute.status = 'built';
    patchRoute(resultRoute._id, resultRoute);
  }
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
