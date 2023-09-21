import express from 'express';

import * as routeController from '../../controllers/route.controller';
import {auth} from '../../middleware/auth';

const router = express.Router();

router.post('/', auth, routeController.createRoute);
router.post('/merge', auth, routeController.mergeRoutes);
router.get('/', auth, routeController.getAll);
router.get('/:id', auth, routeController.getRoute);
router.patch('/:id', auth, routeController.patchRoute);
router.delete('/:id', auth, routeController.deleteRoute);

export default router;
