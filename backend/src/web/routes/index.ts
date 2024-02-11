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
 *        description: Если true, выдаст только выполненые заявки / маршруты, если false, то только невыполненные. Если ничего не стоит то выдаст все
 *        items:
 *          type: boolean
 *      - in: query
 *        type: boolean
 *        name: active
 *        description: Если true, выдаст только выполняемые в данный момент маршруты (это свойство есть только у маршрутов), если false, то не выполняемые на данный момент. Если ничего не стоит то выдаст все
 *        items:
 *          type: boolean
 *      - in: query
 *        name: vanger
 *        type: string
 *        description: id вангера данного маршрута
 *        items:
 *          type: string
 *      - in: query
 *        name: type
 *        description: Если order, выдаст только заявки, если route - то выдаст только маршруты, иначе выдаст и то, и другое
 *        items:
 *          type: string
 *        
 *    responses:
 *      200:
 *        description: Возвращает объект с двумя массивами orders и routes
 */
router.get('/deals', routeController.getAllDeals);

/**
 * @openapi
 * /similar/:id/:
 * get:
 *    description: получение всех гомоморфных объектов
 *    parameters:
 *    - in: query
 *        name: type
 *        type: string
 *        description: Если order, выдаст заявки, если route - то выдаст маршруты
 * 
 */
router.get('/similar/:id', routeController.getSimilarDeals);

export default router;
