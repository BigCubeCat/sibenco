import {schema, schemaComplex} from './schema';

export const swCreateRoute = {
  summary: 'create route',
  description: 'Add a new route',
  tags: ['route', 'специалист АХО'],
  operationId: 'createRoute',
  requestBody: {
    description: 'Create a new route',
    content: {
      'application/json': {
        schema: {
          ...schema,
        },
      },
    },
  },
  responses: {
    '200': {
      description: 'Done',
    },
    default: {
      description: 'Something went wrong!',
      // Add some different errors
    },
  },
};

export const swGetAllRoutes = {
  summary: 'routes info',
  description: 'Getting info about all routes',
  tags: ['route', 'специалист АХО'],
  operationId: 'getAllRoutes',
  responses: {
    '200': {
      description: 'Done',
      content: {
        'application/json': {
          schema: {
            ...schema,
          },
        },
      },
    },
    default: {
      description: 'Something went wrong!',
      // Add some different errors
    },
  },
};

export const swGetRoute = {
  summary: 'route info',
  description: 'Getting info about route',
  tags: ['route', 'специалист АХО', 'представитель транспортной компании'],
  parameters: [
    {
      name: 'routeId',
      in: 'path',
      description: 'ID of route to return',
      required: true,
      schema: {
        type: 'integer',
        format: 'int64',
      },
    },
  ],
  operationId: 'getRoute',
  responses: {
    '200': {
      description: 'Done',
      content: {
        'application/json': {
          schema: {
            ...schema,
          },
        },
      },
    },
    default: {
      description: 'Something went wrong!',
      // Add some different errors
    },
  },
};

export const swPatchRoute = {
  summary: 'patch route',
  description: 'Change route info',
  tags: ['route', 'специалист АХО'],
  requestBody: {
    content: {
      'application/json': {
        schema: {
          ...schema,
        },
      },
    },
  },
  parameters: [
    {
      name: 'routeId',
      in: 'path',
      description: 'ID of route to patch',
      required: true,
      schema: {
        type: 'integer',
        format: 'int64',
      },
    },
  ],
  operationId: 'patchRoute',
  responses: {
    '200': {
      description: 'Done',
    },
    default: {
      description: 'Something went wrong!',
      // Add some different errors
    },
  },
};

export const swDeleteRoute = {
  summary: 'delete route',
  description: 'Delete route',
  tags: ['route', 'специалист АХО'],
  parameters: [
    {
      name: 'routeId',
      in: 'path',
      description: 'ID of route to delete',
      required: true,
      schema: {
        type: 'integer',
        format: 'int64',
      },
    },
  ],
  operationId: 'deleteRoute',
  responses: {
    '200': {
      description: 'Done',
    },
    default: {
      description: 'Something went wrong!',
      // Add some different errors
    },
  },
};

export const swFindSimilarRoutes = {
  summary: 'similar routes',
  description: 'Find similar routes',
  tags: ['route', 'специалист АХО'],
  parameters: [
    {
      name: 'routeID',
      in: 'path',
      schema: {
        type: 'integer',
        format: 'int64',
      },
      required: true,
    },
  ],
  operationId: 'findSimilarRoutes',
  responses: {
    '200': {
      description: 'Done',
      content: {
        'application/json': {
          schema: {
            ...schema,
          },
        },
      },
    },
    default: {
      description: 'Something went wrong!',
      // Add some different errors
    },
  },
};

export const swMergeRoutes = {
  summary: 'merge routes',
  description:
    'merge routes by id. Set status "merged" to deleted routes and status "built" to updated route',
  tags: ['route', 'специалист АХО'],
  parameters: [
    {
      routes: 'routes',
      schema: {
        type: 'routes',
        format: 'text',
      },
      required: true,
    },
  ],
  operationId: 'mergeRoutes',
  responses: {
    '200': {
      description: 'Done',
      content: {
        'application/json': {
          schema: {
            ...schema,
          },
        },
      },
    },
    default: {
      description: 'Something went wrong!',
      // Add some different errors
    },
  },
};


export const swCreateComplex = {
  summary: 'Create route with it\'s orders ',
  description:
    'Add new  route and it\'s orders. After that connect new route with new orders',
  tags: ['route', 'специалист АХО', 'complex'],
  operationId: 'createComplex',
  requestBody: {
    description: 'Create new route with it\'s orders',
    content: {
      'application/json': {
        schema: {
          ...schemaComplex,
        },
      },
    },
  },
  responses: {
    '200': {
      description: 'Done',
    },
    default: {
      description: 'Something went wrong!',
      // Add some different errors
    },
  },
}

export const swGetAllComplexes = {
  summary: 'complexes info',
  description: 'Getting info about all complexes. Returns all compex objects',
  tags: ['route', 'специалист АХО', 'complex'],
  operationId: 'getAllComplexes',
  responses: {
    '200': {
      description: 'Done',
      content: {
        'application/json': {
          schema: {
            ...schemaComplex,
          },
        },
      },
    },
    default: {
      description: 'Something went wrong!',
      // Add some different errors
    },
  },
};

export const swGetComplex = {
  summary: 'complex info and similar complexes',
  description: 'Getting info about complex by route id. Return list of complexes: first complex - searched, other - similar complexes',
  tags: ['route', 'специалист АХО', 'представитель транспортной компании'],
  parameters: [
    {
      name: 'routeId',
      in: 'path',
      description: 'ID of route in complex, which will be in response',
      required: true,
      schema: {
        type: 'integer',
        format: 'int64',
      },
    },
  ],
  operationId: 'getComplexWithSimilar',
  responses: {
    '200': {
      description: 'Done',
      content: {
        'application/json': {
          schema: {
            ...schemaComplex,
          },
        },
      },
    },
    default: {
      description: 'Something went wrong!',
      // Add some different errors
    },
  },
};

export const swPatchComplex = {
  summary: 'patch complex',
  description: 'Change route and orders info. Server expected complex object with route(require: with defined id in parametr) and orders' +
    'If order has id, server will update this order, else server will create it.' +
    'After that all updated and created orders will be connected to updated route' +
    'Server returns updated complex object',
  tags: ['route', 'специалист АХО'],
  requestBody: {
    content: {
      'application/json': {
        schema: {
          ...schemaComplex,
        },
      },
    },
  },
  parameters: [
    {
      name: 'routeId',
      in: 'path',
      description: 'ID of route in complex object to patch',
      required: true,
      schema: {
        type: 'integer',
        format: 'int64',
      },
    },
  ],
  operationId: 'patchComplex',
  responses: {
    '200': {
      description: 'Done',
    },
    default: {
      description: 'Something went wrong!',
      // Add some different errors
    },
  },
};


export const swMergeComplexes = {
  summary: 'merge routes in complexes',
  description:
    'merge routes in complexes by id of route. Set status "merged" to deleted routes and status "built" to updated route',
  tags: ['route', 'специалист АХО'],
  parameters: [
    {
      routes: 'routeIDs',
      schema: {
        type: 'routes',
        format: 'text',
      },
      required: true,
    },
  ],
  operationId: 'mergeComplexes',
  responses: {
    '200': {
      description: 'Done',
      content: {
        'application/json': {
          schema: {
            ...schemaComplex,
          },
        },
      },
    },
    default: {
      description: 'Something went wrong!',
      // Add some different errors
    },
  },
};

