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
 *        description: id первого маршрута
 *      - in: query
 *        name: second
 *        type: string
 *        description: id второго маршрута
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
