import express from 'express';

import * as routeController from '../controllers/route.controller';

const router = express.Router();

/**
 * @openapi
 * /routes/std/:
 *  post:
 *    description: Создание маршрута (Эта ручка вообще нужна? Разве это будет происходить не через более сложную ручку?)
 */
router.post('/std/', routeController.createRoute);


/**
 * @openapi
 * /routes/std/create/:id/:
 *  post:
 *    description: Создание маршрута по id заказа
 *    responses:
 *      200:
 *          description: возвращает id созданного маршрута
 */
router.post('/std/create/:id', routeController.createRouteWithOrder);

/**
 * @openapi
 * /routes/std/:
 *  get:
 *    description: получение всех маршрутов
 *    parameters:
 *      - in: query
 *        name: page
 *        type: number
 *        description: номер странцы
 *        items:
 *          type: number
 *      - in: query
 *        name: page_size
 *        type: number
 *        description: размер страницы
 *        items:
 *          type: number
 *      - in: query
 *        type: boolean
 *        name: done
 *        description: Если true, выдаст только выполненые маршруты, если false, то только не выполненые. Если ничего не стоит то выдаст все
 *        items:
 *          type: boolean
 *      - in: query
 *        type: boolean
 *        name: active
 *        description: Если true, выдаст только выполняемые в данный момент маршруты, если false, то не выполняемые на данный момент. Если ничего не стоит то выдаст все
 *        items:
 *          type: boolean
 *      - in: query
 *        name: vanger
 *        type: string
 *        description: id вангера данного маршрута
 *        items:
 *          type: string
 *    responses:
 *      200:
 *        description: Returns a mysterious string.
 */
router.get('/std/', routeController.getAll);

/**
 * @openapi
 * /routes/std/:id/:
 *  get:
 *    description: получение одного заказа по id
 */
router.get('/std/:id', routeController.getRoute);
/**
 * @openapi
 * /routes/std/:id/:
 *  patch:
 *    description: Обновление маршрута по id
 */
router.patch('/std/:id', routeController.patchRoute);
/**
 * @openapi
 * /routes/std/:id/:
 *  delete:
 *    description: Удаление маршрута по id
 */
router.delete('/std/:id', routeController.deleteRoute);


/**
 * @openapi
 * /routes/std/automerge/:
 *  post:
 *    description: Автоматическое слияние маршрутов в один.
 *    parameters:
 *      - in: query
 *        name: first
 *        type: string
 *        description: id первого маршрута / заказа
 *      - in: query
 *        name: second
 *        type: string
 *        description: id второго маршрута / заказа
 *      - in: query
 *        name: first_type
 *        type: string
 *        description: order / route (какой объект сливаем)
 *      - in: query
 *        name: second_type
 *        type: string
 *        description: order / route (какой объект сливаем)
 *    responses:
 *      200:
 *          description: возвращает id получившегося маршрута
 *      400:
 *          description: bad id
 * 
 */
router.post('/std/automerge/', routeController.autoMergeRoute);



//router.post('/std/merge', routeController.mergeRoutes);

export default router;
