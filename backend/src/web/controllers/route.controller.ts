import {Request, Response} from 'express';
import {getErrorMessage} from '../../sdk/utils/error';
import * as routeService from '../service/route.service';
import {config} from '../../config';
import {TOrderDoc} from '../db/order.db';
import {I_RouterDocument, IRouteDoc} from '../db/route.db';
import {createAbstractController, createSimpleAbstractController} from './abstract.controller';

export const createRoute = createAbstractController(
  async (req: Request) => {
    return {code: 200, body: await routeService.createRoute(req.body)};
  },
);

export const getAll = createAbstractController(
  async (req: Request) => {
    const page: number =
      typeof req.query.page == 'string' ? Number(req.query.page) : 0;
    const pageSize: number =
      typeof req.query.page_size == 'string'
        ? Number(req.query.page_size)
        : config.PAGE_SIZE;
    const results = routeService.getAll(page, pageSize);
    return {code: 200, body: {results}};
  },
);

export const getRoute = createAbstractController(
  async (req: Request) => {
    if (!req.params.id) {
      return {code: 400, body: getErrorMessage(new Error('Bad id'))};
    }
    return {code: 200, body: await routeService.getRoute(req.params.id)};
  },
);

export const patchRoute = createAbstractController(
  async (req: Request) => {
    const id: string = req.params.id ? req.params.id : '';
    if (id == '') {
      return {code: 400, body: getErrorMessage(new Error('Bad id'))};
    }
    return {code: 200, body: await routeService.patchRoute(req.params.id, req.body)};
  },
);

export const deleteRoute = createAbstractController(
  async (req: Request) => {
    return {code: 200, body: await routeService.deleteRoute(req.params.id)};
  },
);

export const mergeRoutes = createSimpleAbstractController(
  async (req: Request) => await routeService.merge(req.body.routes),
);

export const findSimilarRoutes = createSimpleAbstractController(
  async (req: Request) => await routeService.findSimilarRoutes(req.params.id),
);

export const createComplex = createAbstractController(
  // Вынести в сервис
  async (req: Request) => {
    const ordersObjects: TOrderDoc[] = [];
    const ordersIds: string[] = [];

    for (let i = 0; i < req.body.orders.length; i++) {
      // const newOrder = await orderService.createSingleOrder(req.body.orders[i]);
      // ordersIds.push("" + newOrder._id);
    }
    const newRouteDTO: IRouteDoc = req.body.route;
    newRouteDTO.route.orders = ordersIds;
    const newRoute = await routeService.createRoute(newRouteDTO);
    return {code: 200, body: {'route': newRoute, 'orders': ordersObjects}};
  },
);

export const getAllComplexes = createSimpleAbstractController(
  async (req: Request) => {
    const page: number =
      typeof req.query.page == 'string' ? Number(req.query.page) : 0;
    const pageSize: number =
      typeof req.query.page_size == 'string'
        ? Number(req.query.page_size)
        : config.PAGE_SIZE;
    const results = await routeService.getAll(page, pageSize);
    const responseArray = [];
    for (let i = 0; i < results.length; i++) {
      const orders: TOrderDoc[] = [];
      for (let j = 0; j < results[i].route.orders.length; j++) {
        /* const currentOrder = await orderService.getOrder(results[i].route.orders[j]);
        if (currentOrder) {
          orders.push(currentOrder);
        }
         */
      }
      responseArray.push({'route': results[i], 'orders': orders});
    }
    return responseArray;
  },
);


export const patchComplex = createAbstractController(
  async (req: Request) => {
    if (!req.params.id) {
      return {code: 400, body: getErrorMessage(new Error('Bad id'))};
    }

    const newRoute = await routeService.patchRoute(req.params.id, req.body.route);
    if (!newRoute) {
      return {code: 400, body: getErrorMessage(new Error('No routes exist with that id'))};
    }
    newRoute?.route.orders.splice(0, newRoute?.route.orders.length);
    if (req.body.orders[0] != null) {
      let orderId: string = req.body.orders[0]._id ? req.body.orders[0]._id : '';
      const orders: TOrderDoc[] = [];
      for (let i = 0; i < req.body.orders.length; i++) {
        orderId = req.body.orders[i]._id ? req.body.orders[i]._id : '';
        if (orderId == '') {
          /*const newOrder = await orderService.createOrder(req.body.orders[i]);
          newRoute?.route.orders.push(newOrder._id);
          orders.push(newOrder);
          */
        } else {
          /*
          const updatedOrder = await orderService.updateOrder(orderId, req.body.orders[i]);
          newRoute?.route.orders.push(updatedOrder?._id);
          orders.push(updatedOrder!!); // добавить обработку случаев с нулевыми параметрами
           */
        }
      }
      //routeService.patchRoute(newRoute?._id, newRoute!!);
      return {code: 200, body: {'route': newRoute, 'orders': orders}};
    } else {
      return {
        code: 200, body: {'route': newRoute, 'orders': []},
      };
    }
  },
);


export const getComplex = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.status(400).send(getErrorMessage(new Error('Bad id')));
    }
    const foundRoute = await routeService.getRoute(req.params.id);
    if (!foundRoute) {
      return res.status(400).send(getErrorMessage(new Error('No routes exist with that id')));
    }
    const results = await routeService.findSimilarRoutes(req.params.id);
    console.log('results = ', results);
    const resultRoutes: I_RouterDocument[] = [];
    resultRoutes.push(foundRoute);
    resultRoutes.push(...results);
    const responseArray = [];
    console.log('resultRoutes = ', resultRoutes);
    for (let i = 0; i < resultRoutes.length; i++) {
      if (resultRoutes[i].route.orders.length != 0) {
        /*
        const firstOrder = await orderService.getOrder(resultRoutes[i].route.orders[0]);
        const objectJson = {"route": resultRoutes[i], "orders": [firstOrder]};
        for (let j = 1; j < resultRoutes[i].route.orders.length; j++) {
          const currentOrder = await orderService.getOrder(resultRoutes[i].route.orders[j]);
          objectJson.orders.push(currentOrder);
        }
        responseArray.push(objectJson);
        */
      } else {
        responseArray.push({'route': resultRoutes[i], 'orders': []});
      }
    }
    res.status(200).send(responseArray);
  } catch (error) {
    return res.status(500).send(getErrorMessage(error));
  }
};

export const mergeComplexes = async (req: Request, res: Response) => {
  try {
    const resultRoute = await routeService.merge(req.body.routes);
    const orders: TOrderDoc[] = [];

    for (let i = 0; i < req.body.orders.length; i++) {
      /*
      const newOrder = await orderService.createOrder(req.body.orders[i]);
      orders.push(newOrder);
      resultRoute.route.orders.push(newOrder._id);
      await routeService.patchRoute(resultRoute._id, resultRoute);
       */
    }
    res.status(200).send({'route': resultRoute, 'orders': orders});
  } catch (error) {
    return res.status(500).send(getErrorMessage(error));
  }
};
