import {schema} from './schema';

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
