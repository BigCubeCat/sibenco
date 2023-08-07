import express from 'express';

import * as routeController from '../controllers/order.controller';
import {auth} from '../middleware/auth';
import {isAxo, isEmployee, roleMiddleware} from "../middleware/roleMiddleware";

const router = express.Router();

router.post('/', [auth, isEmployee], routeController.createOrder);
router.get('/', [auth, isAxo], routeController.getAllOrders);
router.get('/:id', [auth, roleMiddleware(["axo", "employee"])], routeController.getOrder);
router.patch('/:id', [auth, roleMiddleware(["axo", "employee"])], routeController.updateOrder);
router.delete('/:id', [auth, roleMiddleware(["axo", "employee"])], routeController.deleteOrder);
router.delete('/:client', [auth, isAxo], routeController.findOrdersBySomething);

export default router;
