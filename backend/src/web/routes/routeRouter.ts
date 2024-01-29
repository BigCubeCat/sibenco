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

//router.post('/std/merge', routeController.mergeRoutes);

export default router;
