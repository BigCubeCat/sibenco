import RouteModel from '../model/route/route.model';
import {TRouteDTO} from '../dto/route.dto';
import {config} from '../../config';
import {autoMergeRoutes, getAllRoutes, manualCreateRoute, getSimilarRoutes, pinOrders} from '../model/route/route.function';
import {IRouteData} from '../model/route/route.interface';
import OrderModel from '../model/order/order.model';
import { TWaypointsDTO } from '../dto/waypoints.dto';
import {deleteVanger} from '../../conn/vangers/vangers.conn';

export const create = async (dto: TRouteDTO) => {
  const route = new RouteModel();
  await route.createFromDTO(dto);
  await route.dump();
  await pinOrders(route);
  return route.ID;
};

export const createWithOrderID = async (id: string) => {
  const route = new RouteModel();
  await route.createFromOrderID(id);
  if (route.invalid) {
    throw new Error(config.errors.BadId);
  }
  await route.dump();
  await pinOrders(route);
  if (route.saved)
    return route.ID;
  throw new Error(config.errors.Create);

}

export const manualCreate = async (ids: string[], waypoints: TWaypointsDTO) => { //TODO довести ручку до роутера
  const route = await manualCreateRoute(ids, waypoints);
  if (route.invalid) {
    throw new Error(config.errors.NotFound);
  }
  await route.dump();
  return route.ID; //TODO добавить аргумент тип машины и выбор подходящего вангера
}

export const get = async (id: string) => {
  const route = new RouteModel();
  await route.fromId(id);
  if (route.invalid) {
    throw new Error(config.errors.NotFound);
  }
  return route.outDTO;
};


export const getAll = async (page: number, pageSize: number, done: string, active: string, vanger: string) => {
  return await getAllRoutes(page, pageSize, done, active, vanger);
};

export const del = async (id: string) => {
  const route = new RouteModel();
  await route.fromId(id);

  const vangerId: string | undefined = route.vanger;
  if (vangerId) {
    await deleteVanger(vangerId);
  }

  return await route.delete();
};

export const patch = async (id: string, data: IRouteData) => {
  const route = new RouteModel();
  await route.fromId(id);
  if (route.invalid) {
    throw new Error(config.errors.NotFound);
  }
  route.fromIRouteData(data);
  return await route.update();
};


export const autoMerge = async (firstId: string, secondId: string) => {
  const resultRoute = await autoMergeRoutes(firstId, secondId);
  if (resultRoute.invalid) {
    throw new Error(config.errors.BadId);
  }
  await resultRoute.dump();
  return resultRoute.ID;
}


export const advancedAutoMerge = async (firstId: string, secondId: string, firstType: string, secondType: string) => {
  if (firstType == "order" && secondType == "order") {
    const firstRouteId: string = await createWithOrderID(firstId);
    const secondRouteId: string = await createWithOrderID(secondId);
    return autoMerge(firstRouteId, secondRouteId);
  } else if (firstType == "order" && secondType == "route") {
    const firstRouteId: string = await createWithOrderID(firstId);
    return autoMerge(firstRouteId, secondId);
  } else if (firstType == "route" && secondType == "order") {
    const secondRouteId: string = await createWithOrderID(secondId);
    return autoMerge(firstId, secondRouteId);
  } else if (firstType == "route" && secondType == "route") {
    console.log("Hello");
    return autoMerge(firstId, secondId);
  } else {
    throw new Error(config.errors.NotFound);
  }
}

export const changeExecutionState = async (id: string, state: string) => {
  const route = new RouteModel();
  await route.fromId(id);
  if (route.invalid) {
    throw new Error(config.errors.BadId);
  }
  console.log(state);
  if (state === "start") {
    route.active = true;
    console.log(route.active);
    return await route.update();
  } else if (state === "stop") {
    route.active = false;
    return await route.update();
  } else if (state === "finish") {
    route.active = false;
    route.done = true;
    await route.update();
    route.ordersIds?.forEach(async order => {
      const orderM = new OrderModel();
      await orderM.fromId(order);
      orderM.done = true;
      await orderM.update();
    });
    return;
  } else {
    throw new Error(config.errors.NotFound);
  }
}


/*
TODO: Сделать проверки на корректность ID
 */
export const changeVanger = async (routeId: string, vangerId: string) => {
  const route = new RouteModel();
  await route.fromId(routeId);
  if (route.invalid) {
    throw new Error(config.errors.NotFound);
  }
  return await route.setVangerId(vangerId);
}

export const getSimilar = async (id: string, matchPercent: number) => {
  return await getSimilarRoutes(id, matchPercent);
};

