import {config} from '../../config';
import {TOrderDTO} from '../dto/order.dto';
import OrderModel from '../model/order/order.model';
import {findOrders, getAllOrders, getSimilarOrders} from '../model/order/order.functions';
import {IOrderData} from '../model/order/order.interface';
import {countOrders as count} from "../model/order/order.functions";
import RouteModel from "../model/route/route.model";
import {getSuitableVanger} from "../../conn/vangers/vangers.conn";

/*
 * createSingleOrder(order, TOrderDoc)
 */
export const create = async (orderDto: TOrderDTO) => {
  console.log(orderDto);
  const order = new OrderModel();
  console.log(order)
  await order.fromDTO(orderDto);
  console.log(order);
  await order.dump();

  console.log(order);

  if (!order.deadline.noDeadline) {
    console.log('here');
    // Создаем маршрут автоматически
    const vanger = await getSuitableVanger(
      order.cargo,
      order.deadline,
      order.points[0].address || 'ru'
    );
    console.log("vanger = ", vanger);
    const route = new RouteModel();
    const orders = order.orderData ? [order.orderData] : [];
    await route.createFromDTO({
      orders: orders,
      waypoints: {points: order.points},
      deadline: order.deadline,
      clients: [order.orderData?.clientId || ''],
      vanger: vanger?.id || ""
    });
    await route.dump();
    console.log('here\n');
  }
  
  return order.ID;
};

export const countOrders = async () => {
  return await count();
};

export const get = async (id: string) => {
  const order = new OrderModel();
  await order.fromId(id);
  if (order.invalid) {
    throw new Error(config.errors.NotFound);
  }
  return order.outDTO;
};

export const getAll = async (page: number, pageSize: number, done: string) => {
  return await getAllOrders(page, pageSize, done);
};

export const getSimilar = async (id: string, matchPercent: number) => {
  return await getSimilarOrders(id, matchPercent);
};

export const deleteOrder = async (id: string) => {
  const order = new OrderModel();
  await order.fromId(id);
  if (order.invalid) {
    throw new Error(config.errors.NotFound);
  }
  await order.delete();
};

export const updateOrder = async (id: string, data: IOrderData) => {
  // Тут именно IOrderData, потому что пользователь может обновить список остановок. TODO кстати
  const order = new OrderModel();
  await order.fromId(id);
  if (order.invalid) {
    throw new Error(config.errors.NotFound);
  }
  order.fromIOrderData(data);
  await order.update();
};

export const cleanOrderCache = async (id: string) => {
  const order = new OrderModel();
  await order.fromId(id);
  if (order.invalid) {
    throw new Error(config.errors.NotFound);
  }
  await order.setDone();
}

export const find = async (data: object, page: number, pageSize: number) => {
  return await findOrders(page, pageSize, data);
};

