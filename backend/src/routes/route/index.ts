import {
  swCreateRoute,
  swDeleteRoute,
  swFindSimilarRoutes,
  swGetAllRoutes,
  swGetRoute,
  swPatchRoute,
  swMergeRoutes,
} from './docs';

export const swRouteRoute = {
  '/routes': {
    post: {
      ...swCreateRoute,
    },
    get: {
      ...swGetAllRoutes,
    },
  },
  '/routes/{routeID}': {
    get: {
      ...swGetRoute,
    },
    patch: {
      ...swPatchRoute,
    },
    delete: {
      ...swDeleteRoute,
    },
  },
  '/routes/{routeID}/similar': {
    get: {
      ...swFindSimilarRoutes,
    },
  },
  'routes/merge': {
    post: {
      ...swMergeRoutes,
    },
  },
};
