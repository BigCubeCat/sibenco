import express from 'express';
import * as routeController from '../controllers/index.controller';


const router = express.Router();

router.get('/', function (req, res, next) {
  res.send('Hello World');
});

/**
 * @openapi
 * /deals/:
 *  get:
 *    description: получение всех заявок, не принадлежащих маршрутам и всех маршрутов
 *    parameters:
 *      - in: query
 *        name: page
 *        type: number
 *        description: номер странцы (если поиск и для маршрутов и для заявок, то для каждого этот номер страницы)
 *        items:
 *          type: number
 *      - in: query
 *        name: page_size
 *        type: number
 *        description: размер страницы (если поиск происходит и для маршрутов и для заявок, то для каждого типа объектов вернётся такое число)
 *        items:
 *          type: number
 *      - in: query
 *        name: done
 *          description: Если true, выдаст только выполненые заявки, если false, то только невыполненные. Если ничего не стоит то выдаст все
 *        items:
 *          type: boolean
 *      - in: query
 *        name: type
 *          description: Если order, выдаст только заявки, если route - то выдаст только маршруты, иначе выдаст и то, и другое
 *        items:
 *          type: boolean
 *        
 *    responses:
 *      200:
 *        description: Возвращает объект с двумя массивами orders и routes
 */
router.get('/deals', routeController.getAllDeals);

export default router;
