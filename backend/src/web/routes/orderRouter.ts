import express from 'express';
import * as routeController from '../controllers/order.controller';


const router = express.Router();

/**
 * @openapi
 * /orders/:
 *   post:
 *     tags:
 *        - orders
 *     description: Создание заказа.
 *     requestBody:
 *        required: true
 *        content:
 *            application/json:
 *                schema:
 *                    $ref: '#components/schemas/OrderDTO'
 *     responses:
 *       200:
 *         description: "id заказа"
 *       400:
 *         description: "Текст ошибки"
 *       500:
 *         description: "Текст ошибки"
 */
router.post('/', routeController.createOrder);

/**
 * @openapi
 * /orders/:
 *  get:
 *    tags:
 *      - orders
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
 *        type: object
 *        description: Все заказы по возрастанию ID
 *        content:
 *            application/json:
 *                schema:
 *                    type: array
 *                    items:
 *                        allOf:
 *                            - $ref: '#components/schemas/OrderDTO'
 */
router.get('/', routeController.getAllOrders);
/**
 * @openapi
 * /orders/:id/:
 *  get:
 *    tags:
 *        - orders
 *    parameters:
 *        - name: id
 *          in: path
 *          required: true
 *    responses:
 *      200:
 *          description: Получение заказа
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      allOf:
 *                          - $ref: '#components/schemas/OrderDTO'
 *      500:
 *          description: Текст ошибки
 *  patch:
 *    tags:
 *        - orders
 *    parameters:
 *        - name: id
 *          in: path
 *          required: true
 *    requestBody:
 *        required: true
 *        content:
 *            application/json:
 *                schema:
 *                    $ref: '#components/schemas/OrderDTO'
 *  delete:
 *    tags:
 *        - orders
 *    parameters:
 *        - name: id
 *          in: path
 *          required: true
 *  put:
 *    tags:
 *        - orders
 *    description: "Сделать заявку сделаной"
 *    parameters:
 *        - name: id
 *          in: path
 *          required: true
 */
router.get('/:id', routeController.getOrder);
router.patch('/:id', routeController.updateOrder);
router.delete('/:id', routeController.deleteOrder);
router.put('/:id', routeController.cleanOrderCache);

/**
 * @openapi
 * /orders/similar/:id/:
 *  get:
 *    tags:
 *        - orders
 *    description: Получение похожих заказов по id оригинального заказа
 *    parameters:
 *        - name: id
 *          in: path
 *          required: true
 *    responses:
 *        200:
 *            content:
 *                application/json:
 *                    schema:
 *                        type: array
 *                        items:
 *                            $ref: '#components/schemas/Res'
 *        500:
 *          description: error message
 */
router.get('/similar/:id', routeController.getSimilar);

/**
 * @openapi
 * /orders/search/:
 *  post:
 *    tags:
 *        - orders
 *    description: Поиск заказов в БД по параметрам запроса в теле запроса. Параметрв такие же, как в mongo
 */
router.post('/search', routeController.findOrdersBySomething);
export default router;
