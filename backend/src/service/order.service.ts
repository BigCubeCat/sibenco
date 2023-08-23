import OrderModel, {TOrderDoc} from '../models/order.model';
import {config} from '../config';
import { createRoute } from './route.service';
import { I_RouterDocument } from '../models/route.model';

export async function createOrder(order: TOrderDoc): Promise<void> {
  try {
    await OrderModel.create(order);
    
    const array = [order];
    const route = {
      orders: array,
      summary_distance: order.distance,
      ts_number: "",
      special_marks: "",
      driver_name: "",
      date: order.date,
    };
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
