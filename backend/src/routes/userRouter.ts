import express from "express";

import * as userController from "../controllers/user.controller";
import { auth } from "../middleware/auth";

const userRouter = express.Router();

userRouter.post("/sign_in", userController.loginOne);
userRouter.get("/me", auth, userController.getMe);
userRouter.get("/name/:email/", auth, userController.getUser);
userRouter.patch("/edit/", auth, userController.patchMe);

userRouter.get("/search", auth, userController.search);

export default userRouter;
