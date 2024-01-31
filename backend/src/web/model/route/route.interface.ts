import {TDeadline} from '../../dto/deadline.dto';
import { TWaypointsDTO } from '../../dto/waypoints.dto';
import {IOrderData, IOrderView} from '../order/order.interface';
import * as orderFunc from '../order/order.interface';

export interface IRouteData {
  id: string;
  orderIds: Array<string>; // Список id заказов, ибо заказ может обновиться
  orders: Array<IOrderData>;
  waypoints: TWaypointsDTO;
  nodes: Array<number>;

  distance: number;
  clients: Array<string>; // Список id клиентов
  vanger: string;
  time: TDeadline;
  totalPrice: number;
}

export interface IRouteView {
  id: string;
  orders: (IOrderView | null)[];
  waypoints: TWaypointsDTO;
  distance: number;
  clients: Array<string>; // Список id клиентов
  vanger: string;
  time: TDeadline;
  totalPrice: number;
}

export const dataToView = (route: IRouteData | null): (IRouteView | null) => {
  if (route) {
    return {
      id: route.id,
      orders: route.orders.map(order => orderFunc.dataToView(order)),
      waypoints: route.waypoints,
      distance: route.distance,
      clients: route.clients,
      vanger: route.vanger,
      time: route.time,
      totalPrice: route.totalPrice,
    };
  }
  return null;
};