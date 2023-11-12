import OrderDb from '../../db/order.db';
import Order from './order.model';

export const getAllOrders = async (page: number, pageSize: number) => {
  const orders = await OrderDb.find({})
    .sort({_id: -1})
    .skip(page * pageSize)
    .limit(pageSize).select({_id: 1});
  return orders.map(o => new Order(o._id));
};

export const getSimilarOrders = async (id: string) => {
  const order = new Order(id);
  if (order.invalid) return [];
  const allOrders = await OrderDb.find({}).select({_id: 1});
  const results = [];
  for (let i = 0; i < allOrders.length; ++i) {
    const other = new Order(allOrders[i]._id);
    const percent = order.matchOrder(other);
    if (order.matchOrder(other) > 0) {
      results.push({order: other, match: percent});
    }
  }
  return [];
};

export const findOrders = async (page: number, pageSize: number, request: object) => {
  const orders = await OrderDb.find({request})
    .sort({_id: -1})
    .skip(page * pageSize)
    .limit(pageSize).select({_id: 1});
  return orders.map(o => new Order(o._id));
};