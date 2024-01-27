import {config} from "../../config";

export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SibGenCoRouting Search Engine',
      version: '1.0.0',
      description: 'A simple Express API using Swagger'
    },
    servers: [
      {
        url: `http://localhost:${config.PORT}`,
        description: 'Search Engine'
      }
    ]
  },
  apis: ['./src/web/routes/*.ts']
};
