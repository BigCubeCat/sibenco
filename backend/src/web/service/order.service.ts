import OrderDb, { TOrderDoc } from '../db/order.db';
import { config } from '../../config';
import { createRoute } from './route.service';
import { IRouteDoc } from '../db/route.db';
import {TOrderDTO} from '../dto/order.dto';
import OrderModel from '../model/order.model';


/*
 * createSingleOrder(order, TOrderDoc)
 * create order WITHOUT route
 */
export async function createSingleOrder(order: TOrderDoc) {
  return await OrderDb.create(order);
}

export async function createOrder(orderDto: TOrderDTO) {
  const orderModel = new OrderModel();
  orderModel.fromDTO(orderDto);
  orderModel.dump();

  return orderModel;
}

export async function getOrder(id: string) {
  return await OrderDb.findById(id);
}

export async function getAllOrders(page: number, pageSize: number) {
  const orders = await OrderDb.find({})
    .sort({ _id: -1 })
    .skip(page * pageSize)
    .limit(pageSize);
  if (!orders) {
    throw new Error(config.errors.NotFound + 'orders');
  }
  return orders;
}

export async function deleteOrder(id: string) {
  await OrderDb.findByIdAndDelete(id);
}

export async function updateOrder(id: string, data: any) {
  return await OrderDb.findByIdAndUpdate({ _id: id }, data, { upsert: true });
}

export async function findOrdersBySomething(
  data: any,
  page: number,
  pageSize: number,
) {
  const orders = await OrderDb.find({ data })
    .sort({ _id: -1 })
    .skip(page * pageSize)
    .limit(pageSize);
  if (!orders) {
    throw new Error(config.errors.NotFound + 'orders');
  }
  return orders;
}

