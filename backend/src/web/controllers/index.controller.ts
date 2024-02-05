import {Request} from 'express';
import {getErrorMessage} from '../../sdk/utils/error';
import * as orderService from '../service/order.service';
import * as routeService from '../service/route.service';
import {config} from '../../config';
import { createAbstractController, createSimpleAbstractController } from './abstract.controller';

export const getAllDeals = createAbstractController(
    async (req: Request) => {
    const page: number =
      typeof req.query.page == 'string' ? Number(req.query.page) : 0;
    const pageSize: number =
      typeof req.query.page_size == 'string'
        ? Number(req.query.page_size)
            : config.PAGE_SIZE;
    const done: string =
      typeof req.query.done == 'string' ? req.query.done : '';    
    
    if (typeof req.query.type == 'string') {
        if (req.query.type === "order") {
            return {
                code: 200, body: {
                    orders: await orderService.getAll(page, pageSize, done, "true"),
                    routes: []
                }
            };
        } else if (req.query.type === "route") {
            return {
                code: 200, body: {
                    orders: [],
                    routes: await routeService.getAll(page, pageSize)
                }
            };        
        }
    }
    return {
        code: 200, body: {
            orders: await orderService.getAll(page, pageSize, done, "true"),
            routes: await routeService.getAll(page, pageSize)
        }
    };
  },
);