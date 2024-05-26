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

export const createManualRoute = createAbstractController(
  async (req: Request) => {
    return { code: 200, body: await routeService.manualCreate(req.body.orders, req.body.waypoints) };
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
    const done: string = typeof req.query.done == 'string' ? req.query.done : '';
    const active: string = typeof req.query.active == 'string' ? req.query.active : '';
    const vanger: string = typeof req.query.vanger == 'string' ? req.query.vanger : '';
    const results = await routeService.getAll(page, pageSize, done, active, vanger);
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
    if (!req.query.first || !req.query.second || !req.query.first_type || !req.query.second_type) {
      return {code: 400, body: getErrorMessage(new Error('Bad id'))};
    }
    if (typeof req.query.first !== "string" || typeof req.query.second !== "string" || typeof req.query.first_type !== "string" || typeof req.query.second_type !== "string") {
      return {code: 400, body: getErrorMessage(new Error('Bad id'))};
    }
    return {code: 200, body: await routeService.advancedAutoMerge(req.query.first, req.query.second, req.query.first_type, req.query.second_type)};
  }
)



export const changeExecution = createAbstractController(
  async (req: Request) => {
    if (typeof req.query.id !== "string" || typeof req.query.state !== "string") {
      return {code: 400, body: getErrorMessage(new Error('Bad id'))};
    }
    return {code: 200, body: await routeService.changeExecutionState(req.query.id, req.query.state)};
  }
);

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

