import express from "express";

import * as routeController from "../controllers/route.controller"
import { auth } from "../middleware/auth";

const router = express.Router();

router.post("/", auth, routeController.createRoute);
router.get("/:id", auth, routeController.getRoute);

export default router;

