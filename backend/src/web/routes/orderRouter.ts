import express from 'express';
import * as routeController from '../controllers/order.controller';


const router = express.Router();

/**
 * @openapi
 * /orders/:
 *   post:
 *     description: Создание заказа.
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
router.post('/', routeController.createOrder);

/**
 * @openapi
 * /orders/:
 *  get:
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
 *    description: получение всех заказов
 *    responses:
 *      200:
 *        description: Returns a mysterious string.
 */
router.get('/', routeController.getAllOrders);
/**
 * @openapi
 * /orders/:id/:
 *  get:
 *    description: Получение одного заказа по id
 */
router.get('/:id', routeController.getOrder);
/**
 * @openapi
 * /orders/similar/:id/:
 *  get:
 *    description: Получение похожих заказов по id оригинального заказа
 */
router.get('/similar/:id', routeController.getSimilar);

/**
 * @openapi
 * /orders/:id/:
 *  patch:
 *    description: Обновление заказа по id. Тело запроса как при создании
 */
router.patch('/:id', routeController.updateOrder);

/**
 * @openapi
 * /orders/:id/:
 *  delete:
 *    description: Удалание заказа по id
 */
router.delete('/:id', routeController.deleteOrder);

/**
 * @openapi
 * /orders/search/:
 *  post:
 *    description: Поиск заказов в БД по параметрам запроса в теле запроса. Параметрв такие же, как в mongo
 */
router.post('/search', routeController.findOrdersBySomething);
export default router;
