import {Request} from 'express';
import {getErrorMessage} from '../../sdk/utils/error';
import * as orderService from '../service/order.service';
import {config} from '../../config';
import {createAbstractController, createSimpleAbstractController} from "./abstract.controller";

export const createOrder = createSimpleAbstractController(
  async (req: Request) => await orderService.createOrder(req.body)
);

export const getOrder = createAbstractController(
  async (req: Request) => {
    if (!req.params.id) {
      return {code: 400, body: getErrorMessage(new Error(config.errors.BadId))}
    }
    return {code: 200, body: await orderService.getOrder(req.params.id)}
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
    return await orderService.getAllOrders(page, pageSize);
  }
);

export const deleteOrder = createAbstractController(
  async (req: Request) => {
    if (!req.params.id) {
      return {code: 400, body: getErrorMessage(new Error(config.errors.BadId))}
    }
    await orderService.deleteOrder(req.params.id);
    return {code: 200, body: config.messages.successDelete};
  }
);

export const updateOrder = createAbstractController(
  async (req: Request) => {
    if (!req.params.id) {
      return {code: 400, body: getErrorMessage(new Error(config.messages.successUpdate))}
    }
    await orderService.updateOrder(req.params.id, req.body);
    return {code: 200, body: config.messages.successUpdate};
  });

export const findOrdersBySomething = createSimpleAbstractController(
  async (req: Request) => {
    const page: number =
      typeof req.query.page == 'string' ? Number(req.query.page) : 0;
    const pageSize: number =
      typeof req.query.page_size == 'string'
        ? Number(req.query.page_size)
        : config.PAGE_SIZE;
    const orders = await orderService.findOrdersBySomething(req.body, page, pageSize);
    return {orders};
  }
);
