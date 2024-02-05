import RouteModel from '../model/route/route.model';
import {TRouteDTO} from '../dto/route.dto';
import {config} from '../../config';
import {autoMergeRoutes, getAllRoutes, pinOrders} from '../model/route/route.function';
import {IRouteData} from '../model/route/route.interface';

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
  return route.ID;
}

export const get = async (id: string) => {
  const route = new RouteModel();
  await route.fromId(id);
  if (route.invalid) {
    throw new Error(config.errors.NotFound);
  }
  return route.outDTO;
};

export const getAll = async (page: number, pageSize: number, done: string) => {
  return await getAllRoutes(page, pageSize, done);
};

export const del = async (id: string) => {
  const route = new RouteModel();
  await route.fromId(id);
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

