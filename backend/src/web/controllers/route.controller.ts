import {Request} from 'express';
import {getErrorMessage} from '../../sdk/utils/error';
import * as routeService from '../service/route.service';
import {config} from '../../config';
import {createAbstractController} from './abstract.controller';

export const createRoute = createAbstractController(
  async (req: Request) => {
    return {code: 200, body: await routeService.create(req.body)};
  },
);

export const createRouteWithOrder = createAbstractController(
  async (req: Request) => {
    const id: string = req.params.id ? req.params.id : '';
    if (id == '') {
      return {code: 400, body: getErrorMessage(new Error('Bad id'))};
    }
    return {code: 200, body: await routeService.createWithOrderID(id)};
  }
);

export const getAll = createAbstractController(
  async (req: Request) => {
    const page: number =
      typeof req.query.page == 'string' ? Number(req.query.page) : 0;
    const pageSize: number =
      typeof req.query.page_size == 'string'
        ? Number(req.query.page_size)
        : config.PAGE_SIZE;
    const results = await routeService.getAll(page, pageSize);
    return {code: 200, body: {results}};
  },
);

export const getRoute = createAbstractController(
  async (req: Request) => {
    if (!req.params.id) {
      return {code: 400, body: getErrorMessage(new Error('Bad id'))};
    }
    return {code: 200, body: await routeService.get(req.params.id)};
  },
);

export const patchRoute = createAbstractController(
  async (req: Request) => {
    const id: string = req.params.id ? req.params.id : '';
    if (id == '') {
      return {code: 400, body: getErrorMessage(new Error('Bad id'))};
    }
    return {code: 200, body: await routeService.patch(req.params.id, req.body)};
  },
);

export const deleteRoute = createAbstractController(
  async (req: Request) => {
    return {code: 200, body: await routeService.del(req.params.id)};
  },
);

export const autoMergeRoute = createAbstractController(
  async (req: Request) => {
    if (!req.query.first || !req.query.second) {
      return {code: 400, body: getErrorMessage(new Error('Bad id'))};
    }
    if (typeof req.query.first !== "string" || typeof req.query.second !== "string") {
      return {code: 400, body: getErrorMessage(new Error('Bad id'))};
    }
    return {code: 200, body: await routeService.autoMerge(req.query.first, req.query.second)};
  }
)

export const changeVanger = createAbstractController(
  async (req: Request) => {
    return {code: 200, body: await routeService.changeVanger(req.params.id, req.params.vanger)};
  }
)

export const getSimilar = createAbstractController(
  async (req: Request) => {
    if (!req.params.id) {
      return {code: 400, body: getErrorMessage(new Error(config.errors.BadId))};
    }
    const matchPercent = Number(req.query.match) || 0.5;
    return {code: 200, body: await routeService.getSimilar(req.params.id, matchPercent)};
  },
);
