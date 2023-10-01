import {
  swCreateRoute,
  swDeleteRoute,
  swFindSimilarRoutes,
  swGetAllRoutes,
  swGetRoute,
  swPatchRoute,
  swMergeRoutes,
  swCreateComplex,
  swGetAllComplexes,
  swGetComplex,
  swPatchComplex,
  swMergeComplexes
} from './docs';

export const swRouteRoute = {
  '/routes/std': {
    post: {
      ...swCreateRoute,
    },
    get: {
      ...swGetAllRoutes,
    },
  },
  '/routes/std/{routeID}': {
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
  '/routes/std/{routeID}/similar': {
    get: {
      ...swFindSimilarRoutes,
    },
  },
  'routes/std/merge': {
    post: {
      ...swMergeRoutes,
    },
  },
  '/routes/complex': {
    post: {
      ...swCreateComplex
    },
    get: {
      ...swGetAllComplexes
    }
  },
  '/routes/complex/{routeID}': {
    patch: {
      ...swPatchComplex
    },
    get: {
      ...swGetComplex
    }
  },
  'routes/complex/merge': {
    post: {
      ...swMergeComplexes
    }
  }

  
};
