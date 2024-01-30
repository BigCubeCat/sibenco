import {config} from '../../config';
import {TOrderDTO} from '../dto/order.dto';
import OrderModel from '../model/order/order.model';
import {findOrders, getAllOrders, getSimilarOrders} from '../model/order/order.functions';
import {IOrderData} from '../model/order/order.interface';

/*
 * createSingleOrder(order, TOrderDoc)
 */
export const create = async (orderDto: TOrderDTO) => {
  const order = new OrderModel();
  await order.fromDTO(orderDto);
  await order.dump();
  return order.ID;
};

export const get = async (id: string) => {
  const order = new OrderModel();
  await order.fromId(id);
  if (order.invalid) {
    throw new Error(config.errors.NotFound);
  }
  return order.outDTO;
};

export const getAll = async (page: number, pageSize: number) => {
  return await getAllOrders(page, pageSize);
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

