import express from 'express';

import * as routeController from '../../controllers/route.controller';
import {auth} from '../../middleware/auth';

const router = express.Router();

router.post('/std/', auth, routeController.createRoute);
router.post('/std/merge', auth, routeController.mergeRoutes);
router.get('/std/', auth, routeController.getAll);
router.get('/std/:id', auth, routeController.getRoute);
router.patch('/std/:id', auth, routeController.patchRoute);
router.delete('/std/:id', auth, routeController.deleteRoute);
router.get('/std/:id/similar', auth, routeController.findSimilarRoutes);

router.post('/complex/', auth, routeController.createComplex);
router.get('/complex/', auth, routeController.getAllComplexes);
router.patch('/complex/', auth, routeController.patchComplex);
router.get('/complex/:id', auth, routeController.getComplex);
router.post('/complex/merge', auth, routeController.mergeComplexes);

export default router;
