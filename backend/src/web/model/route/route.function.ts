import RouteDb from '../../db/route.db';
import OrderDb from '../../db/order.db';

import RouteModel from './route.model';
import OrderModel from '../order/order.model';

export const getAllRoutes = async (page: number, pageSize: number) => {
  const routes = await RouteDb.find({})
    .sort({_id: -1})
    .skip(page * pageSize)
    .limit(pageSize).select({_id: 1});
  const results = [];
  for (let i = 0; i < routes.length; ++i) {
    const r = new RouteModel();
    await r.fromId(routes[i]._id);
    results.push(r.outDTO);
  }
};

export const getSimilarOrders = async (id: string) => {
  const route = new RouteModel();
  await route.fromId(id);
  if (route.invalid) return [];
  const allOrders = await OrderDb.find({}).select({_id: 1});
  const results = [];
  for (let i = 0; i < allOrders.length; ++i) {
    const other = new OrderModel();
    await other.fromId(allOrders[i]._id);
    const percent = route.matchOrder(other);
    if (percent > 0) {
      results.push({order: other.outDTO, match: percent});
    }
  }
  return [];
};

export const findRoutes = async (page: number, pageSize: number, request: object) => {
  const routes = await RouteDb.find({request})
    .sort({_id: -1})
    .skip(page * pageSize)
    .limit(pageSize).select({_id: 1});
  const results = [];
  for (let i = 0; i < routes.length; ++i) {
    const r = new RouteModel();
    await r.fromId(routes[i]._id);
    results.push(r.outDTO);
  }
  return results;
};

// TODO
// Поиск всех маршрутов с пагинацией
// поиск ЗАКАЗОВ, которые можно слить в этот Route
// поиск ВАНГЕРОВ
