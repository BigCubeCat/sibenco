import {
  swCreateOrder,
  swDeleteOrder,
  swFindByTags,
  swGetOrder,
  swPatchOrder,
  swGetAllOrders,
} from './docs';

export const swOrderRoute = {
  '/orders/{orderID}': {
    get: {
      ...swGetOrder,
    },
    delete: {
      ...swDeleteOrder,
    },
    patch: {
      ...swPatchOrder,
    },
  },
  '/orders': {
    get: {
      ...swGetAllOrders,
    },
    post: {
      ...swCreateOrder,
    },
  },
  '/orders/orders?{someTag}={someTagValue}': {
    get: {
      ...swFindByTags,
    },
  },
};
