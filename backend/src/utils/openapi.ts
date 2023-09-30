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
       **Термины, используемые ниже:**\
      Заказ - это структура данных, содержащая информацию о перевозке груза. В частности начальный и конечный пункт.\
      Маршрут - это структура данных, содержащая информацию о перевозке груза и некоторую дополнительную информацию. В частности маршрут состоит из списка заказов.\
      **Описание работы проекта:**\
        1. Ответственный сотрудник создаёт заказ. При желании он этот заказ может удалить.\
        2. Специалист ахо помимо редактирования, поиска и удаления заказов может также искать, создавать, редактировать и удалять маршруты.\
          После создания заказа маршрут создаётся автоматически. Далее специалист ахо может объединить маршруты в один с помощью функции поиска похожих маршрутов.\
        3. Представитель транспортной компании может просмотреть информацию о маршруте.\
        4. Администратор может добавлять, удалять и редактировать пользователей.\
        **Команда для запуска**: docker-compose build && docker-compose up или docker-compose up.**\
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
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
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
