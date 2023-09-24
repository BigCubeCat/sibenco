import RouteModel, {I_RouterDocument} from '../models/route.model';
import errors from '../properties/errors';
import {getInterval} from '../utils/date';

export async function createRoute(route: I_RouterDocument) {
  try {
    // get boxes
    return await RouteModel.create(route);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function patchRoute(id: string, route: I_RouterDocument) {
  try {
    return await RouteModel.findOneAndUpdate({_id: id}, route);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteRoute(id: string) {
  try {
    await RouteModel.findByIdAndRemove(id);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getRoute(id: string) {
  try {
    return await RouteModel.findOne({_id: id});
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAll(page: number, page_size: number) {
  try {
    const allRoutes = await RouteModel.find()
      .sort({_id: -1})
      .skip(page * page_size)
      .limit(page_size);
    if (!allRoutes) {
      throw new Error('not found');
    }
    return allRoutes;
  } catch (error) {
    console.log(error);
    throw error;
  }
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

export async function getNearestInTimeRoutes(id: string) {
  const sampleRoute = await getRoute(id);
  if (sampleRoute !== null) {
    try {
      const timeInterval = getInterval(sampleRoute.date, 1, 1);
      const nearestRoutes = RouteModel.find().where('date').in(timeInterval);
      if (!nearestRoutes) {
        throw new Error('not found');
      }
      return nearestRoutes;
    } catch (error) {
      console.log(error);
      throw error;
    }
  } else {
    console.log(errors.NotFound);
  }
}
