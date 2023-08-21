import {schema, schemaSignIn} from './schema';

export const swSignIn = {
  summary: 'authorization',
  description: 'Log in to the system',
  tags: [
    'user',
    'ответственный сотрудник',
    'специалист АХО',
    'представитель транспортной компании',
    'администратор',
  ],
  parameters: [
    {
      name: 'Authorization',
      in: 'header',
      description: 'authorization data',
      required: true,
      schema: {
        ...schemaSignIn,
      },
    },
  ],
  operationId: 'signIn',
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

export const swGetMe = {
  summary: 'info about yorself',
  description: 'Getting info about yourself',
  tags: [
    'user',
    'ответственный сотрудник',
    'специалист АХО',
    'представитель транспортной компании',
    'администратор',
  ],
  parameters: [
    {
      name: 'email',
      in: 'query',
      description: 'your email',
      required: true,
      schema: {
        type: 'string',
        format: 'email',
      },
    },
  ],
  operationId: 'getMe',
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

export const swGetUser = {
  summary: 'info about user',
  description: 'Getting info about user',
  tags: ['user', 'администратор'],
  parameters: [
    {
      name: 'email',
      in: 'path',
      description: 'User email',
      required: true,
      schema: {
        type: 'string',
        format: 'email',
      },
    },
  ],
  operationId: 'getUser',
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

export const swPatchUser = {
  summary: 'patch user',
  description: 'Change user info',
  tags: ['user', 'администратор'],
  parameters: [
    {
      name: 'email',
      in: 'path',
      description: 'User email',
      required: true,
      schema: {
        type: 'string',
        format: 'email',
      },
    },
  ],
  requestBody: {
    content: {
      'application/json': {
        schema: {
          ...schema,
        },
      },
    },
  },
  operationId: 'patchUser',
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

export const swDeleteUser = {
  summary: 'delete user',
  description: 'Delete user',
  tags: ['user', 'администратор'],
  parameters: [
    {
      name: 'email',
      in: 'path',
      description: 'User email',
      required: true,
      schema: {
        type: 'string',
        format: 'email',
      },
    },
  ],
  operationId: 'deleteUser',
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

export const swGetAllUsers = {
  summary: 'users info',
  description: 'Getting info about all users',
  tags: ['user', 'администратор'],
  operationId: 'getAllUsers',
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

export const swCreateUser = {
  summary: 'create user',
  description: 'Add a new user',
  tags: ['user', 'администратор'],
  operationId: 'createUser',
  requestBody: {
    description: 'Create a new user',
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

export const swFindByEmail = {
  summary: 'users by their email',
  description: 'Getting users by their email',
  tags: ['user', 'администратор'],
  parameters: [
    {
      name: 'email',
      in: 'path',
      description: 'email to serach',
      required: false,
      explode: true,
      schema: {
        type: 'string',
        format: 'email',
      },
    },
  ],
  operationId: 'findByEmail',
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
