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
import {TDeadline, getDeadlineUnion} from '../../dto/deadline.dto';
import {TNaiveCmp, naiveCompareBoxes} from "../../../sdk/algo/compare";
import {IRouteView} from "./route.interface";
import { TOrderDTO } from '../../dto/order.dto';
import { TCargoDTO } from '../../dto/cargo.dto';
import { TVangerDTO } from '../../dto/vanger.dto';
import { getSuitableVanger, getVangerById } from '../../../conn/vangers/vangers.conn';
import { convertToOSM, getPointsCoords, recoverAddress } from '../../dto/address.dto';
import { makeOptimalRoute } from '../../../sdk/route_machine_api';
import { createCoords } from '../../../sdk/algo/coords';
import { getMaxCargo } from '../../../sdk/algo/backpack_problem';
import { TLocationDTO } from '../../dto/location.dto';
export type TSearchRes = { route: IRouteView | null, match: TNaiveCmp };
export type TBackpackParams = { passengers: number, freights: number };

export const getAllRoutes = async (page: number, pageSize: number, done: string, active: string, vanger: string) => {
  const useDone = (done === 'true' || done === 'false');
  const useActive = (active === 'true' || active === 'false');
  const filter = {
    done: (useDone) ? (done === 'true') : { $exists: true },
    active: (useActive) ? (active === 'true') : { $exists: true },
    vanger: (vanger !== "")? vanger : { $exists: true }
  }

  const routes = await RouteDb.find(filter)
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

export const manualCreateRoute = async (ids: string[], waypoints: TWaypointsDTO, cargo: TCargoDTO) => {
  const orders: TOrderDTO[] = [];
  for (let i = 0; i < ids.length; ++i) {
    const order = new OrderModel();
    await order.fromId(ids[i]);
    if (order.orderData) {
     orders.push(order.orderData); 
    }
  }

  let currentDeadline: TDeadline = { noDeadline: true };

  for (let i = 0; i < orders.length; ++i) {
    currentDeadline = getDeadlineUnion(currentDeadline, orders[i].deadline);
  }

  // определяем водителя
  const location: TLocationDTO = {
      latitude: waypoints.points[0].latitude || "n",
      longitude: waypoints.points[0].longitude || "n"
  };

  if (location.latitude == "n" || location.longitude == "n") {
    const resultModel = new RouteModel();
    resultModel.setInvalid = true;
    return resultModel;
  }

  console.log(cargo);
  console.log(currentDeadline);
  console.log(location);

  const vanger: TVangerDTO | undefined = await getSuitableVanger(cargo, currentDeadline, location);
  let vangerId: string;

  if (!vanger) {
      vangerId = "0";
  } else {
    vangerId = vanger.id;
  }

  const resultRouteDTO: TRouteDTO = {
    orders: orders,
    waypoints: waypoints,
    deadline: currentDeadline,
    clients: orders.map(order => { return order.clientId}),
    vangerId: vangerId
  }
  const resultModel = new RouteModel();
  await resultModel.createFromDTO(resultRouteDTO);    
  return resultModel;
}

const checkVangerCapacity = async (backPack: TBackpackParams, vangerId: string): Promise<boolean> => {
  const vanger: TVangerDTO | undefined = await getVangerById(vangerId);
  if (!vanger) return false;
  if (vanger.car.amountOfCargoInCar < backPack.freights || vanger.car.numberOfPassengersInCar < backPack.passengers) {
    return false;
  }
  return true;
}


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
    const resultQueue = mergeWaypoints(secondRouteCoords, secondRouteWaypoints, firstRouteWaypoints);

    // Считаем максимальную необходимую вместимость

    // генерируем груз и проверяем водителя
    const maxBackpackParams = getMaxCargo([...firstParentRoute.orders || [], ...secondParentRoute.orders || []], resultQueue);

    let resultVangerId = secondParentRoute.outDTO?.vanger || "Кожанов Александр Иванович";
    if (!(await checkVangerCapacity(maxBackpackParams, secondParentRoute.outDTO?.vanger || "0"))) {
      const sampleCargo: TCargoDTO = {
        unit: (maxBackpackParams.freights > 0) ? ((maxBackpackParams.passengers > 0) ? "all" : "cargo") : ((maxBackpackParams.passengers > 0) ? "human" : "all"),
        numberOfPassengersInCar: maxBackpackParams.passengers,
        amountOfCargoInCar: maxBackpackParams.freights,
        passengers: [],
        freights: [],
        department: " ",
        description: " "
      }

      const location: TLocationDTO = {
        latitude: resultQueue.points[0].latitude || "0",
        longitude: resultQueue.points[0].longitude || "0"
      }; //TODO так нельзя надо нормальное исключение делать

      console.log("sample cargo:");
      console.log(sampleCargo);

      const vanger: TVangerDTO | undefined = await getSuitableVanger(sampleCargo, getDeadlineUnion(firstParentRoute.deadline, secondParentRoute.deadline), location);
      if (!vanger) {
          resultVangerId = '0';
      } else {
        resultVangerId = vanger.id;
      }
    }

    //Первый маршрут лежит на втором, делаем слияние
    const resultRouteDTO: TRouteDTO = {
      orders: [],
      waypoints: resultQueue,
      deadline: getDeadlineUnion(firstParentRoute.deadline, secondParentRoute.deadline),
      clients: [...secondParentRoute.outDTO?.clients || [], ...firstParentRoute.outDTO?.clients || []],
      vangerId: resultVangerId
    }
    
    const resultModel = new RouteModel();
    await resultModel.createFromDTO(resultRouteDTO);
    resultModel.ordersIds = [...firstParentRoute.ordersIds, ...secondParentRoute.ordersIds];
    return resultModel;
  } else {
    //Второй маршрут лежит на первом
    const resultQueue = mergeWaypoints(firstRouteCoords, firstRouteWaypoints, secondRouteWaypoints)
    const maxBackpackParams = getMaxCargo([...firstParentRoute.orders || [], ...secondParentRoute.orders || []], resultQueue);

    let resultVangerId = firstParentRoute.outDTO?.vanger || "Кожанов Александр Иванович";

    if (!(await checkVangerCapacity(maxBackpackParams, secondParentRoute.outDTO?.vanger || "0"))) {
      const sampleCargo: TCargoDTO = {
        unit: (maxBackpackParams.freights > 0) ? ((maxBackpackParams.passengers > 0) ? "all" : "cargo") : ((maxBackpackParams.passengers > 0) ? "human" : "all"),
        numberOfPassengersInCar: maxBackpackParams.passengers,
        amountOfCargoInCar: maxBackpackParams.freights,
        passengers: [],
        freights: [],
        department: " ",
        description: " "
      }


      const location: TLocationDTO = {
        latitude: resultQueue.points[0].latitude || "0",
        longitude: resultQueue.points[0].longitude || "0"
      }; //TODO так нельзя надо нормальное исключение делать

    
      const vanger: TVangerDTO | undefined = await getSuitableVanger(sampleCargo, getDeadlineUnion(firstParentRoute.deadline, secondParentRoute.deadline), location);
      if (!vanger) {
          resultVangerId = '0';
      } else {
        resultVangerId = vanger.id;
      }
    }

    const resultRouteDTO: TRouteDTO = {
      orders: [],
      waypoints: resultQueue,
      deadline: getDeadlineUnion(firstParentRoute.deadline, secondParentRoute.deadline),
      clients: [...firstParentRoute.outDTO?.clients || [], ...secondParentRoute.outDTO?.clients || []],
      vangerId: resultVangerId
    }
    const resultModel = new RouteModel();
    await resultModel.createFromDTO(resultRouteDTO);
    resultModel.ordersIds = [...firstParentRoute.ordersIds, ...secondParentRoute.ordersIds];
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
upd: потестил, пофиксил, баги остались
 */
export const getSimilarRoutes = async (id: string, matchPercent = 0.5, ordersMatchPercent = 0.5) => {
  const route = new RouteModel();
  await route.fromId(id);
  if (route.invalid) return [];

  const answerSet = new Set<string>();
  if (!route.orders) {
    return [];
  }

  for (let i = 0; i < route.orders.length; ++i) {
    const id = route.orders[i].id;
    const ids = await orderFunctions.getSimilarOrders(id, ordersMatchPercent); 
    for (let j = 0; j < ids.length; ++j) {
      const order = ids[j].order;
      if (!order) continue;
      answerSet.add(order.routeId);
    }
  }
  console.log("answer set:")
  console.log(answerSet);
  
  //Здесь надо сделать как с заявками: строим маршруты по waypoints и сверяем их с помощью нужного метода, определяем процент совпадения и возможность автомёрджа

  const routesIds = Array.from(answerSet);
  routesIds.push(id);
  const routesCoords = await routesIds.map(
    async id => {
      const currentRoute = new RouteModel();
      await currentRoute.fromId(id);

      currentRoute.waypoints.points = currentRoute.waypoints.points.map(
        point => recoverAddress(point)
      );
      
      const optimalRoute = await makeOptimalRoute(
        currentRoute.waypoints.points.map(
          point => convertToOSM(point)
        )
      );

      return createCoords(
          optimalRoute?.coords || [],
          currentRoute.waypoints.points.map(point => getPointsCoords(point))
        );
    }
  );

  const results: TSearchRes[] = [];

  for (let i = 0; i < routesCoords.length - 1; ++i){
    const compareResult = naiveCompareBoxes(await routesCoords[i], await routesCoords[routesCoords.length - 1]);
    
    if (compareResult.match > matchPercent) {
      const resRoute = new RouteModel();
      await resRoute.fromId(routesIds[i]);
      results.push({route: resRoute.outDTO, match: compareResult});
    }
  }

  return results;
};


// TODO
// Исправить ситуацию когда outDTO возвращает null
// Поиск всех маршрутов с пагинацией
// поиск ЗАКАЗОВ, которые можно слить в этот Route
// поиск ВАНГЕРОВ
