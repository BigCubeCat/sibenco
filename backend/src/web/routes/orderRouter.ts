import express from 'express';
import * as routeController from '../controllers/order.controller';


const router = express.Router();

router.post('/', routeController.createOrder);

router.get('/', routeController.getAllOrders);
router.get('/:id', routeController.getOrder);
router.get('/similar/:id', routeController.getSimilar);

router.patch('/:id', routeController.updateOrder);

router.delete('/:id', routeController.deleteOrder);

router.post('/search', routeController.findOrdersBySomething);
export default router;
