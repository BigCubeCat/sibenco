import RouteModel from '../model/route/route.model';
import {TRouteDTO} from '../dto/route.dto';
import {config} from '../../config';
import {autoMergeRoutes, getAllRoutes, manualCreateRoute, getSimilarRoutes, pinOrders} from '../model/route/route.function';
import {IRouteData} from '../model/route/route.interface';
import OrderModel from '../model/order/order.model';
import { TWaypointsDTO } from '../dto/waypoints.dto';
import {deleteVanger} from '../../conn/vangers/vangers.conn';
import { TCargoDTO } from '../dto/cargo.dto';

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

export const manualCreate = async (ids: string[], waypoints: TWaypointsDTO, cargo: TCargoDTO) => {
  const route = await manualCreateRoute(ids, waypoints, cargo);
  if (route.invalid) {
    throw new Error(config.errors.NotFound);
  }
  await route.dump();
  await pinOrders(route);
  if (route.saved)
    return route.ID;
  throw new Error(config.errors.Create);
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
  if (vangerId && (await getAllRoutes(0,2,"","",vangerId)).length == 1) {
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
  if (resultRoute.vanger === "" || resultRoute.vanger === "0" || resultRoute.vanger === " ") {
    throw new Error(config.errors.NotFound);
  }
  await resultRoute.dump();
  await pinOrders(resultRoute);
  del(firstId);
  del(secondId);
  return resultRoute.ID;
}


export const advancedAutoMerge = async (firstId: string, secondId: string, firstType: string, secondType: string) => {
  if (firstType == "order" && secondType == "order") {
    const firstRouteId: string = await createWithOrderID(firstId);
    const secondRouteId: string = await createWithOrderID(secondId);
    const resultRouteId: string = await autoMerge(firstRouteId, secondRouteId);
    const route = new RouteModel();
    await route.fromId(resultRouteId);
    await pinOrders(route);
    return resultRouteId;
  } else if (firstType == "order" && secondType == "route") {
    const firstRouteId: string = await createWithOrderID(firstId);
    const resultRouteId: string = await autoMerge(firstRouteId, secondId);
    const route = new RouteModel();
    await route.fromId(resultRouteId);
    await pinOrders(route);
    return resultRouteId;
  } else if (firstType == "route" && secondType == "order") {
    const secondRouteId: string = await createWithOrderID(secondId);
    const resultRouteId: string = await autoMerge(firstId, secondRouteId);
    const route = new RouteModel();
    await route.fromId(resultRouteId);
    await pinOrders(route);
    return resultRouteId;
  } else if (firstType == "route" && secondType == "route") {
    const resultRouteId: string = await autoMerge(firstId, secondId);
    const route = new RouteModel();
    await route.fromId(resultRouteId);
    await pinOrders(route);
    return resultRouteId;
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

