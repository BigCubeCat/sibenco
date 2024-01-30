import OrderDb from '../../db/order.db';
import OrderModel from './order.model';
import {naiveCompareBoxes, TNaiveCmp} from "../../../sdk/algo/compare";
import {IOrderView} from "./order.interface";
import getRedisClient from "../../../conn/cache/redis.conn";
import {getRedisKey} from "../../../sdk/algo/coords";

export type TSearchRes = { order: IOrderView | null, match: TNaiveCmp };

const compareFunction = (a: TSearchRes, b: TSearchRes) => {
  if (
    (a.match.ableToMerge === b.match.ableToMerge)
  ) {
    const res = b.match.match - a.match.match;
    if (res === 0) {
      const aId = a.order?.id || '';
      const bId = b.order?.id || '';
      if (aId < bId) return -1;
      if (aId > bId) return 1;
      return 0;
    }
    return res;
  }
  return b.match.match - a.match.match;
}

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

export const getSimilarOrders = async (id: string, matchPercent = 0.5) => {
  const order = new OrderModel();
  await order.fromId(id);
  if (order.invalid) return [];

  const redisConn = await getRedisClient();
  const neighborKeys = order.points.map(point => getRedisKey(
    {
      lat: Number(point.latitude),
      lon: Number(point.longitude),
      type: point.pointType,
    })
  );
  const allMembers = new Set<string>();
  for (let i = 0; i < neighborKeys.length; ++i) {
    const mems = await redisConn.getAllMembers(neighborKeys[i]);
    mems.forEach(mem => allMembers.add(mem));
  }
  const allOrders = await OrderDb.find({
    '_id': {
      '$in': Array.from(allMembers)
    },
    'done': false
  }).select({_id: -1});

  const results: TSearchRes[] = [];
  for (let i = 0; i < allOrders.length; ++i) {
    if (allOrders[i]._id.toString() == id) {
      continue;
    }
    const other = new OrderModel();
    await other.fromId(allOrders[i]._id.toString());

    const compareResult = naiveCompareBoxes(other.boxes, order.boxes);

    if (compareResult.match > matchPercent) {
      results.push({order: other.outDTO, match: compareResult});
    }
  }
  return results.sort(compareFunction);
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