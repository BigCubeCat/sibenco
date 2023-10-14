import { Request, Response } from 'express';
import { getErrorMessage } from '../utils/error';
import * as routeService from '../service/route.service';
import * as orderService from '../service/order.service';
import { config } from '../config';
import { TOrderDoc } from '../models/order.model';
import {I_RouterDocument, IRouteDoc} from '../models/route.model';

export const createRoute = async (req: Request, res: Response) => {
  try {
    const newRoute = await routeService.createRoute(req.body);
    res.status(200).send(newRoute);
  } catch (error) {
    return res.status(500).send(getErrorMessage(error));
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const page: number =
      typeof req.query.page == 'string' ? Number(req.query.page) : 0;
    const pageSize: number =
      typeof req.query.page_size == 'string'
        ? Number(req.query.page_size)
        : config.PAGE_SIZE;
    const results = await routeService.getAll(page, pageSize);
    res.status(200).send({ results });
  } catch (error) {
    return res.status(500).send(getErrorMessage(error));
  }
};

export const getRoute = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.status(400).send(getErrorMessage(new Error('Bad id')));
    }
    const foundRoute = await routeService.getRoute(req.params.id);
    res.status(200).send(foundRoute);
  } catch (error) {
    return res.status(500).send(getErrorMessage(error));
  }
};

export const patchRoute = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id ? req.params.id : '';
    if (id == '') {
      return res.status(400).send(getErrorMessage(new Error('Bad id')));
    }
    const newRoute = await routeService.patchRoute(req.params.id, req.body);
    res.status(200).send(newRoute);
  } catch (error) {
    return res.status(500).send(getErrorMessage(error));
  }
};

export const deleteRoute = async (req: Request, res: Response) => {
  try {
    const newRoute = await routeService.deleteRoute(req.params.id);
    res.status(200).send(newRoute);
  } catch (error) {
    return res.status(500).send(getErrorMessage(error));
  }
};

export const mergeRoutes = async (req: Request, res: Response) => {
  try {
    const resultRoute = await routeService.merge(req.body.routes);
    res.status(200).send(resultRoute);
  } catch (error) {
    return res.status(500).send(getErrorMessage(error));
  }
};

export const findSimilarRoutes = async (req: Request, res: Response) => {
  try {
    const resultRoutes = await routeService.findSimilarRoutes(req.params.id);
    res.status(200).send(resultRoutes);
  } catch (error) {
    return res.status(500).send(getErrorMessage(error));
  }
}

export const createComplex = async (req: Request, res: Response) => {
  try {
    const ordersObjects: TOrderDoc[] = [];
    const ordersIds: string[] = [];

    for (let i = 0; i < req.body.orders.length; i++) {
      const newOrder = await orderService.createSingleOrder(req.body.orders[i]);
      console.log("newOrder = ", newOrder);
      ordersIds.push("" + newOrder._id);
    }
    console.log(ordersIds);
    const newRouteDTO: IRouteDoc = req.body.route;
    newRouteDTO.route.orders = ordersIds;
    console.log(newRouteDTO);
    const newRoute = await routeService.createRoute(newRouteDTO);
    res.status(200).send({ "route": newRoute, "orders": ordersObjects });

  } catch (error) {
    return res.status(500).send(getErrorMessage(error));
  }
};


export const getAllComplexes = async (req: Request, res: Response) => {
  try {
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
        const currentOrder = await orderService.getOrder(results[i].route.orders[j]);
        if (currentOrder) {
          orders.push(currentOrder);
        }
      }
      responseArray.push({ "route": results[i], "orders": orders });

    }
    res.status(200).send(responseArray);
  } catch (error) {
    return res.status(500).send(getErrorMessage(error));
  }
};


export const patchComplex = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.status(400).send(getErrorMessage(new Error('Bad id')));
    }

    const newRoute = await routeService.patchRoute(req.params.id, req.body.route);
    if (!newRoute) {
      return res.status(400).send(getErrorMessage(new Error('No routes exist with that id')));
    }
    newRoute?.route.orders.splice(0, newRoute?.route.orders.length);
    if (req.body.orders[0] != null) {
      let orderId: string = req.body.orders[0]._id ? req.body.orders[0]._id : '';
      const orders: TOrderDoc[] = [];
      for (let i = 0; i < req.body.orders.length; i++) {
        let orderId: string = req.body.orders[i]._id ? req.body.orders[i]._id : '';
        if (orderId == '') {
          const newOrder = await orderService.createOrder(req.body.orders[i]);
          newRoute?.route.orders.push(newOrder._id);
          orders.push(newOrder);
        } else {
          const updatedOrder = await orderService.updateOrder(orderId, req.body.orders[i]);
          newRoute?.route.orders.push(updatedOrder?._id);
          orders.push(updatedOrder!!); // добавить обработку случаев с нулевыми параметрами
        }
      }
      routeService.patchRoute(newRoute?._id, newRoute!!);
      res.status(200).send({ "route": newRoute, "orders": orders });
    } else {
      res.status(200).send({ "route": newRoute, "orders": [] });
    }
  } catch (error) {
    return res.status(500).send(getErrorMessage(error));
  }
};


export const getComplex = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.status(400).send(getErrorMessage(new Error('Bad id')));
    }
    const foundRoute = await routeService.getRoute(req.params.id);
    if (!foundRoute) {
      return res.status(400).send(getErrorMessage(new Error('No routes exist with that id')));
    }
    const resultRoutes = await routeService.findSimilarRoutes(req.params.id);
    const deleteIndex = resultRoutes.indexOf(foundRoute);
    resultRoutes.splice(deleteIndex, 1);
    resultRoutes.splice(0, 0, foundRoute);    
    const responseArray = [];
    for (let i = 0; i < resultRoutes.length; i++) {
      if (resultRoutes[i].route.orders.length != 0) {
        const firstOrder = await orderService.getOrder(resultRoutes[i].route.orders[0]);
        const objectJson = { "route": resultRoutes[i], "orders": [firstOrder] };
        for (let j = 1; j < resultRoutes[i].route.orders.length; j++) {
          const currentOrder = await orderService.getOrder(resultRoutes[i].route.orders[j]);
          objectJson.orders.push(currentOrder);
        }
        responseArray.push(objectJson);
      } else {
        responseArray.push({ "route": resultRoutes[i], "orders": [] });
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
      const newOrder = await orderService.createOrder(req.body.orders[i]);
      orders.push(newOrder);
      resultRoute.route.orders.push(newOrder._id);
      await routeService.patchRoute(resultRoute._id, resultRoute);
    }
    res.status(200).send({ "route": resultRoute, "orders": orders });
  } catch (error) {
    return res.status(500).send(getErrorMessage(error));
  }
};
