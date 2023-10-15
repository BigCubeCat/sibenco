import { convertIntoBoxes, AnswerType } from '../geocoder';
import RouteModel, { IRouteDoc, I_RouterDocument } from '../models/route.model';
import { getNearestInBoxesRoutes } from '../utils/routes_filter/routes_by_boxes';
import { getNearestInTimeRoutes } from '../utils/routes_filter/routes_by_time';
import { filterRoutesWithStatus } from '../utils/routes_filter/routes_by_status';
import * as orderService from '../service/order.service';
import OrderModel, { IOrder, TOrderDoc } from '../models/order.model';
import * as dateModule from '../utils/date';

export async function createRoute(route: IRouteDoc) {
  const resultOfConvertObject = await convertIntoBoxes(route, 0);
  if (resultOfConvertObject === undefined) {
    console.log("Boxes wasn't created");
    return await RouteModel.create(route);
  }
  route.route.boxes = resultOfConvertObject.words;
  return await RouteModel.create(route);
}

export async function patchRoute(id: string, route: I_RouterDocument) {
  return await RouteModel.findOneAndUpdate({ _id: id }, route);
}

export async function deleteRoute(id: string) {
  await RouteModel.findByIdAndRemove(id);
}

export async function getRoute(id: string): Promise<I_RouterDocument | null | undefined> {
  return await RouteModel.findOne({ _id: id });
}

export async function getAll(page: number, page_size: number) {
  const allRoutes = await RouteModel.find()
    .sort({ _id: -1 })
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
    isPrivate: false,
    isSingle: false,
    cargoInRoute: firstRoute.cargoInRoute,
    passengersInRoute: firstRoute.passengersInRoute,
    comment: firstRoute.comment
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

  const newWordsAndWaypoints = await convertIntoBoxes(newRoute, 1);
  if (newWordsAndWaypoints === undefined) {
    console.log("new orders wasn't created");
    return await createRoute(newRoute);
  }
  newRoute.route.boxes = newWordsAndWaypoints.words;
  newRoute.route.orders = [];
  for (let i = 0; i < newWordsAndWaypoints.waypoints.length - 1; i++) {
    const newOrderInst: IOrder = {
      date: {
        createdAt: dateModule.todayDate(),// Дата создания unix-time
        loadingTime: newRoute.date, // Дата исполнения
        unloadingTime: newRoute.date,
        loadingWaiting: 15,
        unloadingWaiting: 15
      },
      route: {
        loadingAddress: newWordsAndWaypoints.waypoints[i],
        unloadingAddress: newWordsAndWaypoints.waypoints[i + 1],
        distance: "10"
      },
      order: {
        typeOfTransportation: "people",
        devisionName: "Подразделение 1",
        client: "Группа компаний СГК",
        passengers: [
          {
            fullName: "Петров Сергей Евгеньевич",
            phoneNumber: "+7 (961)343-64-36"
          }
        ]
      }
    };
    const newOrder = await orderService.createSingleOrder(newOrderInst);
    if (!newOrder) {
      continue;
    }
    newRoute.route.orders.push(newOrder._id);
  }

  return await RouteModel.create(newRoute);
}

export async function findSimilarRoutes(id: string): Promise<I_RouterDocument[]> {
  const route: I_RouterDocument | null | undefined = await getRoute(id);
  if (route !== null && route !== undefined) {
    let similarRoutes: I_RouterDocument[] | null | undefined = await getNearestInTimeRoutes(route);
    if (similarRoutes === null || similarRoutes === undefined) {
      return [];
    }
    //similarRoutes = filterRoutesWithStatus(similarRoutes);
    let similarRoutesWithBoxes = await getNearestInBoxesRoutes(similarRoutes, route);
    /*if (similarRoutesWithBoxes.length == 1) {
      return similarRoutes;
    }*/
    return similarRoutesWithBoxes;
  }
  return [];
}
