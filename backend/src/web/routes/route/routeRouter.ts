import express from 'express';

import * as routeController from '../../controllers/route.controller';
import {auth} from '../../middleware/auth';

const router = express.Router();

router.post('/std/', auth, routeController.createRoute);
//router.post('/std/merge', auth, routeController.mergeRoutes);
router.get('/std/', auth, routeController.getAll);
router.get('/std/:id', auth, routeController.getRoute);
router.patch('/std/:id', auth, routeController.patchRoute);
router.delete('/std/:id', auth, routeController.deleteRoute);
//router.get('/std/:id/similar', auth, routeController.findSimilarRoutes);

export default router;
