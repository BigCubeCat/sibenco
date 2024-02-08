import {Request} from 'express';
import {getErrorMessage} from '../../sdk/utils/error';
import * as orderService from '../service/order.service';
import {config} from '../../config';
import {createAbstractController, createSimpleAbstractController} from './abstract.controller';

export const createOrder = createSimpleAbstractController(
  async (req: Request) => await orderService.create(req.body),
);

export const advancedCreateOrder = createSimpleAbstractController(
  async (req: Request) => {
    return await orderService.advancedCreate(req.body);
  }
);

export const getAllOrders = createSimpleAbstractController(
  async (req: Request) => {
    const page: number =
      typeof req.query.page == 'string' ? Number(req.query.page) : 0;
    const pageSize: number =
      typeof req.query.page_size == 'string'
        ? Number(req.query.page_size)
        : config.PAGE_SIZE;
    const done: string = typeof req.query.done == 'string' ? req.query.done : '';
    const free: string = typeof req.query.free == 'string' ? req.query.free : '';
    return { code: 200, body: await orderService.getAll(page, pageSize, done, free) };
  },
);

export const getRealizingRoute = createAbstractController(
  async (req: Request) => {
    if (!req.params.id) {
      return {code: 400, body: getErrorMessage(new Error(config.errors.BadId))};
    }
    return {code: 200, body: await orderService.realizingRoute(req.params.id)};
  }
);

export const getCountOrders = createAbstractController(
  async (req: Request) => {
    return {code: 200, body: {count: await orderService.countOrders()}}
  },
);

export const getOrder = createAbstractController(
  async (req: Request) => {
    if (!req.params.id) {
      return {code: 400, body: getErrorMessage(new Error(config.errors.BadId))};
    }
    return {code: 200, body: await orderService.get(req.params.id)};
  },
);

export const getSimilar = createAbstractController(
  async (req: Request) => {
    if (!req.params.id) {
      return {code: 400, body: getErrorMessage(new Error(config.errors.BadId))};
    }
    const matchPercent = Number(req.query.match) || 0.5;
    return {code: 200, body: await orderService.getSimilar(req.params.id, matchPercent)};
  },
);

export const updateOrder = createAbstractController(
  async (req: Request) => {
    if (!req.params.id) {
      return {code: 400, body: getErrorMessage(new Error(config.messages.successUpdate))};
    }
    await orderService.updateOrder(req.params.id, req.body);
    return {code: 200, body: config.messages.successUpdate};
  },
);

export const deleteOrder = createAbstractController(
  async (req: Request) => {
    if (!req.params.id) {
      return {code: 400, body: getErrorMessage(new Error(config.errors.BadId))};
    }
    await orderService.deleteOrder(req.params.id);
    return {code: 200, body: config.messages.successDelete};
  },
);

export const cleanOrderCache = createAbstractController(
  async (req: Request) => {
    if (!req.params.id) {
      return {code: 400, body: getErrorMessage(new Error(config.errors.BadId))};
    }
    await orderService.cleanOrderCache(req.params.id);
    return {code: 200, body: config.messages.successClean};
  },
);


export const findOrdersBySomething = createSimpleAbstractController(
  async (req: Request) => {
    const page: number =
      typeof req.query.page == 'string' ? Number(req.query.page) : 0;
    const pageSize: number =
      typeof req.query.page_size == 'string'
        ? Number(req.query.page_size)
        : config.PAGE_SIZE;
    const orders = await orderService.find(req.body, page, pageSize);
    return {orders};
  },
);
