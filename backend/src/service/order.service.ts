import OrderModel, {TOrderDoc} from '../models/order.model';
import {config} from '../config';
import {createRoute} from './route.service';
import {I_RouterDocument, IRouteDoc} from '../models/route.model';
import {todayDate} from '../utils/date';
import {convertIntoBoxes} from "../geocoder";

export async function createOrder(order: TOrderDoc): Promise<void> {
  try {
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
        driver: 'Ryan Gosling',
      },
      date: todayDate(),
      status: '',
    };
    route.route.boxes = await convertIntoBoxes(route);
    await createRoute(<I_RouterDocument>route);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getOrder(id: string) {
  try {
    return await OrderModel.findById(id);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllOrders(page: number, pageSize: number) {
  try {
    const orders = await OrderModel.find({})
      .sort({_id: -1})
      .skip(page * pageSize)
      .limit(pageSize);
    if (!orders) {
      throw new Error(config.errors.NotFound + 'orders');
    }
    return orders;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteOrder(id: string) {
  try {
    await OrderModel.findByIdAndDelete(id);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateOrder(id: string, data: any) {
  try {
    await OrderModel.findByIdAndUpdate(id, data, {upset: true});
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function findOrdersBySomething(
  data: any,
  page: number,
  pageSize: number,
) {
  try {
    const orders = await OrderModel.find({data})
      .sort({_id: -1})
      .skip(page * pageSize)
      .limit(pageSize);
    if (!orders) {
      throw new Error(config.errors.NotFound + 'orders');
    }
    return orders;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function findSimillarOrders() {
  // TO_DO Create metric
}
