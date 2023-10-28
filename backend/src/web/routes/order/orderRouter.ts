import express from 'express';
import * as routeController from '../../controllers/order.controller';
import {auth} from '../../middleware/auth';

//joiSchema.validateAsync(request.body); - задел на валидацию

const router = express.Router();

router.post('/', auth, routeController.createOrder);
router.get('/', auth, routeController.getAllOrders);
router.get('/:id', auth, routeController.getOrder);
router.patch('/:id', auth, routeController.updateOrder);
router.delete('/:id', auth, routeController.deleteOrder);
router.delete('/:client', auth, routeController.findOrdersBySomething); // TO_DO Сделать возможным поиск не только по клиентам

export default router;
