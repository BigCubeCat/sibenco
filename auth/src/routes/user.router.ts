import express from "express";
import * as controller from "../controllers/user.controller";
import {auth} from "../middleware/auth";

const userRouter = express.Router();

userRouter.get('*', auth, controller.get);
userRouter.post('*', auth, controller.post);
userRouter.patch('*', auth, controller.patch);
userRouter.delete('*', auth, controller.deleteMethode);

export default userRouter;