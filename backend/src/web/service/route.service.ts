import RouteModel from '../model/route/route.model';
import {TRouteDTO} from '../dto/route.dto';
import {config} from '../../config';
import {getAllRoutes} from '../model/route/route.function';
import {IRouteData} from '../model/route/route.interface';

export const create = async (dto: TRouteDTO) => {
  const route = new RouteModel();
  await route.createFromDTO(dto);
  await route.dump();
  return route.ID;
};

export const get = async (id: string) => {
  const route = new RouteModel();
  await route.fromId(id);
  if (route.invalid) {
    throw new Error(config.errors.NotFound);
  }
  return route.outDTO;
};

export const getAll = async (page: number, pageSize: number) => {
  return await getAllRoutes(page, pageSize);
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
