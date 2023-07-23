import express from 'express';

import * as routeController from '../controllers/order.controller';
import {auth} from '../middleware/auth';

const router = express.Router();

router.post('orders/', auth, routeController.createOrder);
router.get('orders/', auth, routeController.getAllOrders);
router.get('orders/:id', auth, routeController.getOrder);
router.patch('orders/:id', auth, routeController.updateOrder);
router.delete('/:id', auth, routeController.deleteOrder);
router.delete('/:client', auth, routeController.findOrdersBySomething);

export default router;
