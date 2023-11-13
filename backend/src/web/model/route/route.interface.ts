import {TDeadline} from '../../dto/deadline.dto';
import {IOrderData, IOrderView} from '../order/order.interface';
import * as orderFunc from '../order/order.interface';

export interface IRouteData {
  orderIds: Array<string>; // Список id заказов, ибо заказ может обновиться
  orders: Array<IOrderData>;

  nodes: Array<number>;

  distance: number;
  clients: Array<string>; // Список id клиентов
  vanger: string;
  time: TDeadline;
  totalPrice: number;
}

export interface IRouteView {
  orders: (IOrderView | null)[];
  distance: number;
  clients: Array<string>; // Список id клиентов
  vanger: string;
  time: TDeadline;
  totalPrice: number;
}

export const dataToView = (route: IRouteData | null): (IRouteView | null) => {
  if (route) {
    return {
      orders: route.orders.map(order => orderFunc.dataToView(order)),
      distance: route.distance,
      clients: route.clients,
      vanger: route.vanger,
      time: route.time,
      totalPrice: route.totalPrice,
    };
  }
  return null;
};