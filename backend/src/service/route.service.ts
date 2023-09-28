import RouteModel, {I_RouterDocument, IRouteDoc} from '../models/route.model';
import errors from '../properties/errors';
import {getInterval} from '../utils/date';

export async function createRoute(route: IRouteDoc) {
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
  return await createRoute(newRoute);
}

export async function getNearestInTimeRoutes(id: string) {
  const sampleRoute = await getRoute(id);
  if (sampleRoute) {
    const timeInterval = getInterval(sampleRoute.date, 1, 1);
    const nearestRoutes = RouteModel.find().where('date').in(timeInterval);
    if (!nearestRoutes) {
      throw new Error('not found');
    }
    return nearestRoutes;
  } else {
    console.log(errors.NotFound);
  }
}
