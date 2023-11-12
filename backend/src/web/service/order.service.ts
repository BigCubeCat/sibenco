import {config} from '../../config';
import {TOrderDTO} from '../dto/order.dto';
import Order, {IOrderData} from '../model/order/order.model';
import {findOrders, getAllOrders, getSimilarOrders} from '../model/order/order.functions';

/*
 * createSingleOrder(order, TOrderDoc)
 */
export const create = async (orderDto: TOrderDTO) => {
  const order = new Order('');
  order.fromDTO(orderDto);
  order.dump();
  return order.ID;
};

export const get = async (id: string) => {
  const order = new Order(id);
  return order.outDTO;
};

export const getAll = async (page: number, pageSize: number) => {
  return await getAllOrders(page, pageSize);
};

export const getSimilar = async (id: string) => {
  return await getSimilarOrders(id);
};

export const deleteOrder = async (id: string) => {
  const order = new Order(id);
  if (order.invalid) {
    throw new Error(config.errors.NotFound);
  }
  order.delete();
};

export const updateOrder = async (id: string, data: IOrderData) => {
  const order = new Order(id);
  if (order.invalid) {
    throw new Error(config.errors.NotFound);
  }
  order.fromIOrderData(data);
  order.update();
};

export const find = async (data: object, page: number, pageSize: number) => {
  return await findOrders(page, pageSize, data);
};

