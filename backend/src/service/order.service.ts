import OrderModel, {TOrderDoc} from '../models/order.model';
import {config} from '../config';
import {createRoute} from './route.service';
import {IRouteDoc} from '../models/route.model';

export async function createOrder(order: TOrderDoc)  {
  const orderModel = await OrderModel.create(order);

  const route: IRouteDoc = {
    route: {
      orders: [orderModel._id],
      boxes: [],
      distance: '0',
    },
    car: {
      tsNumber: '',
      specialMarks: '',
      driver: 'Amogus',
      loadCapacity: 0,
      numberOfSeats: 0
    },
    date: orderModel.date.loadingTime,
    status: "built",
    isPrivate: false,
    isSingle: false,
    cargoInRoute: 0,
    passengersInRoute: 0,
    comment: ''
  };
  await createRoute(<IRouteDoc>route);
  return orderModel;
}

export async function getOrder(id: string) {
  return await OrderModel.findById(id);
}

export async function getAllOrders(page: number, pageSize: number) {
  const orders = await OrderModel.find({})
    .sort({_id: -1})
    .skip(page * pageSize)
    .limit(pageSize);
  if (!orders) {
    throw new Error(config.errors.NotFound + 'orders');
  }
  return orders;
}

export async function deleteOrder(id: string) {
  await OrderModel.findByIdAndDelete(id);
}

export async function updateOrder(id: string, data: any) {
  return await OrderModel.findByIdAndUpdate({ _id: id }, data, {upsert: true});
}

export async function findOrdersBySomething(
  data: any,
  page: number,
  pageSize: number,
) {
  const orders = await OrderModel.find({data})
    .sort({_id: -1})
    .skip(page * pageSize)
    .limit(pageSize);
  if (!orders) {
    throw new Error(config.errors.NotFound + 'orders');
  }
  return orders;
}

