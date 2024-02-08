import RouteDb from '../../db/route.db';
import OrderDb from '../../db/order.db';

import RouteModel from './route.model';
import OrderModel from '../order/order.model';
import * as orderFunctions from '../order/order.functions';
import {TRouteDTO} from '../../dto/route.dto';
import {TWaypointsDTO} from '../../dto/waypoints.dto';
import {
  createCoordsFromWaypoints,
  getFirstWaypointIndexAfterRoute,
  mergeWaypoints
} from '../../../sdk/algo/way_processors';
import {getDeadlineIntersection} from '../../dto/deadline.dto';
import {TNaiveCmp} from "../../../sdk/algo/compare";
import {IRouteView} from "./route.interface";

export type TSearchRes = { object: IRouteView | null, match: TNaiveCmp };

export const getAllRoutes = async (page: number, pageSize: number) => {
  const routes = await RouteDb.find({})
    .sort({_id: -1})
    .skip(page * pageSize)
    .limit(pageSize).select({_id: 1});
  const results = [];
  for (let i = 0; i < routes.length; ++i) {
    const r = new RouteModel();
    await r.fromId(routes[i]._id);
    results.push(r.outDTO);
  }
  return results;
};

export const getSimilarOrders = async (id: string) => {
  const route = new RouteModel();
  await route.fromId(id);
  if (route.invalid) return [];
  const allOrders = await OrderDb.find({}).select({_id: 1});
  const results = [];
  for (let i = 0; i < allOrders.length; ++i) {
    const other = new OrderModel();
    await other.fromId(allOrders[i]._id);
    const percent = route.matchOrder(other);
    if (percent > 0) {
      results.push({order: other.outDTO, match: percent});
    }
  }
  return [];
};

export const findRoutes = async (page: number, pageSize: number, request: object) => {
  const routes = await RouteDb.find({request})
    .sort({_id: -1})
    .skip(page * pageSize)
    .limit(pageSize).select({_id: 1});
  const results = [];
  for (let i = 0; i < routes.length; ++i) {
    const r = new RouteModel();
    await r.fromId(routes[i]._id);
    results.push(r.outDTO);
  }
  return results;
};

export const autoMergeRoutes = async (firstId: string, secondId: string): Promise<RouteModel> => {
  const firstParentRoute = new RouteModel();
  const secondParentRoute = new RouteModel();
  await firstParentRoute.fromId(firstId);
  await secondParentRoute.fromId(secondId);

  // проверка на invalid
  if (firstParentRoute.invalid) {
    return firstParentRoute;
  }

  if (secondParentRoute.invalid) {
    return secondParentRoute;
  }

  const firstRouteWaypoints: TWaypointsDTO = firstParentRoute.stopPoints;
  const secondRouteWaypoints: TWaypointsDTO = secondParentRoute.stopPoints;
  // получили квадратики маршрутов
  const firstRouteCoords = await createCoordsFromWaypoints(firstRouteWaypoints);
  const secondRouteCoords = await createCoordsFromWaypoints(secondRouteWaypoints);
  // надо понять какой маршрут за каким идёт
  let firstIndexAfterIntersection = getFirstWaypointIndexAfterRoute(firstRouteCoords, secondRouteWaypoints);
  // Если индекс равен нулю, значит это первый маршрут лежит на втором
  if (firstIndexAfterIntersection == 0) {
    firstIndexAfterIntersection = getFirstWaypointIndexAfterRoute(secondRouteCoords, firstRouteWaypoints);
    //Если опять индекс равен нулю, значит произошла ошибка
    if (firstIndexAfterIntersection == 0) {
      console.log("routes are not suitable for automatical merge");
      const resultModel = new RouteModel();
      resultModel.setInvalid = true;
      return resultModel;
    }
    //Первый маршрут лежит на втором, делаем слияние
    const resultRouteDTO: TRouteDTO = {
      orders: [...secondParentRoute.orders || [], ...firstParentRoute.orders || []],
      waypoints: mergeWaypoints(secondRouteCoords, secondRouteWaypoints, firstRouteWaypoints),
      deadline: getDeadlineIntersection(firstParentRoute.deadline, secondParentRoute.deadline),
      clients: [...secondParentRoute.outDTO?.clients || [], ...firstParentRoute.outDTO?.clients || []],
      vangerId: secondParentRoute.outDTO?.vanger || "Кожанов Александр Иванович" // TODO пока так, вообще это из-за того что outDTO может вернуть null надо это исправить
    }
    const resultModel = new RouteModel();
    await resultModel.createFromDTO(resultRouteDTO);
    return resultModel;
  } else {
    //Второй маршрут лежит на первом
    const resultRouteDTO: TRouteDTO = {
      orders: [...firstParentRoute.orders || [], ...secondParentRoute.orders || []],
      waypoints: mergeWaypoints(firstRouteCoords, firstRouteWaypoints, secondRouteWaypoints),
      deadline: getDeadlineIntersection(firstParentRoute.deadline, secondParentRoute.deadline),
      clients: [...firstParentRoute.outDTO?.clients || [], ...secondParentRoute.outDTO?.clients || []],
      vangerId: firstParentRoute.outDTO?.vanger || "Кожанов Александр Иванович" // пока так, вообще это из-за того что outDTO может вернуть null надо это исправить
    }
    const resultModel = new RouteModel();
    await resultModel.createFromDTO(resultRouteDTO);
    return resultModel;
  }

}

export const pinOrders = async (route: RouteModel) => {
  if (route.orders) {
    route.orders.forEach(async order =>
    {
      const currentOrderModel = new OrderModel();
      await currentOrderModel.fromId(order.id);
      currentOrderModel.route = route.ID;
      currentOrderModel.update();
    })
  }
}

/*
В теории должно работать, не тестил
 */
export const getSimilarRoutes = async (id: string, matchPercent = 0.5) => {
  const route = new RouteModel();
  await route.fromId(id);
  if (route.invalid) return [];

  const answerSet = new Set<string>();
  if (!route.orders) {
    return [];
  }

  for (let i = 0; i < route.orders.length; ++i) {
    const id = route.orders[i].routeId;
    const ids = await orderFunctions.getSimilarOrders(id, matchPercent);
    for (let j = 0; j < ids.length; ++j) {
      const order = ids[j].order;
      if (!order) continue;
      answerSet.add(order.routeId);
    }
  }
  return Array.from(answerSet);
};

// TODO
// Исправить ситуацию когда outDTO возвращает null
// Поиск всех маршрутов с пагинацией
// поиск ЗАКАЗОВ, которые можно слить в этот Route
// поиск ВАНГЕРОВ
