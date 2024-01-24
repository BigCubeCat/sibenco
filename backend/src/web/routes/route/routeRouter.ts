import express from 'express';

import * as routeController from '../../controllers/route.controller';

const router = express.Router();

router.post('/std/', routeController.createRoute);
//router.post('/std/merge', routeController.mergeRoutes);
router.get('/std/', routeController.getAll);
router.get('/std/:id', routeController.getRoute);
router.patch('/std/:id', routeController.patchRoute);
router.delete('/std/:id', routeController.deleteRoute);
//router.get('/std/:id/similar', auth, routeController.findSimilarRoutes);

export default router;
