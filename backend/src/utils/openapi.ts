import {swOrderRoute} from '../routes/order';
import {swRouteRoute} from '../routes/route';
import {swUserRoute} from '../routes/user';
import {schema as orderSchema} from '../routes/order/schema';
import {schema as routeSchema} from '../routes/route/schema';
import {
  schema as userSchema,
  schemaSignIn as userSignInSchema,
} from '../routes/user/schema';

const swagger = {
  openapi: '3.0.3',
  info: {
    title: 'Express API для СГК',
    version: '1.0.0',
    description:
      'REST API для сгк. Все операции разбиты по тегам. Вот их описание: \
      order/route/user - оперции над заказами/маршрутами/пользователями \
      специалист АХО/ответственный сотрудник/представитель транспортной компании/администратор\
       - содержат операции, которые могут делать соответствующие пользователи. \
       Под ними расположены схемы заказов, маршрутов, пользователей.\
       _Примечание: для пользователей есть две схемы, одна содержит все данные, другая только авторизационные_.',
  },
  servers: [
    {
      url: 'http://127.0.0.1:5000',
      description: 'Development server',
    },
  ],
  paths: {
    ...swOrderRoute,
    ...swRouteRoute,
    ...swUserRoute,
  },
  components: {
    schemas: {
      Orders: {
        type: 'object',
        properties: {
          orderSchema,
        },
      },
      Routes: {
        type: 'object',
        properties: {
          routeSchema,
        },
      },
      Users: {
        type: 'object',
        properties: {
          userSchema,
          userSignInSchema,
        },
      },
    },
  },
};

export default swagger;
