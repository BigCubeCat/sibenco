import OrderDb from '../../db/order.db';
import OrderModel from './order.model';

export const getAllOrders = async (page: number, pageSize: number) => {
  const orders = await OrderDb.find({})
    .sort({_id: -1})
    .skip(page * pageSize)
    .limit(pageSize).select({_id: 1});
  const results = [];
  for (let i = 0; i < orders.length; ++i) {
    const o = new OrderModel();
    await o.fromId(orders[i]._id);
    results.push(o.outDTO);
  }
  return results;
};

export const getSimilarOrders = async (id: string) => {
  const order = new OrderModel();
  await order.fromId(id);
  if (order.invalid) return [];
  const allOrders = await OrderDb.find({}).select({_id: 1});
  const results = [];
  for (let i = 0; i < allOrders.length; ++i) {
    const other = new OrderModel();
    await other.fromId(allOrders[i]._id);
    const percent = order.matchOrder(other);
    if (percent > 0) {
      results.push({order: other.outDTO, match: percent});
    }
  }
  return [];
};

export const findOrders = async (page: number, pageSize: number, request: object) => {
  const orders = await OrderDb.find({request})
    .sort({_id: -1})
    .skip(page * pageSize)
    .limit(pageSize).select({_id: 1});
  const results = [];
  for (let i = 0; i < orders.length; ++i) {
    const o = new OrderModel();
    await o.fromId(orders[i]._id);
    results.push(o.outDTO);
  }
  return results;
};