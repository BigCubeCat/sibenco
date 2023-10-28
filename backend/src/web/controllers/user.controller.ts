import {Request} from 'express';
import * as userServices from '../service/user.service';
import {CustomRequest} from '../middleware/auth';
import {userWithoutPass} from '../models/user.model';
import {createSimpleAbstractController} from "./abstract.controller";

export const createUser = createSimpleAbstractController(
  async (req: Request) => userWithoutPass(await userServices.createUser(req.body))
)

export const loginOne = createSimpleAbstractController(
  async (req: Request) => await userServices.login(req.body)
);

export const getMe = createSimpleAbstractController(
  async (req: Request) => {
    const token = (req as CustomRequest).token;
    const tokenString = typeof token === 'string' ? token : token?.email;
    return await userServices.getUser(tokenString);
  }
);

export const getUser = createSimpleAbstractController(
  async (req: Request) => {
    return await userServices.getOtherUser(req.params.email)
  }
)

export const patchMe = createSimpleAbstractController(
  async (req: Request) => {
    const token = (req as CustomRequest).token;
    const tokenString = typeof token === 'string' ? token : token?._id;
    return await userServices.patchUser(tokenString, req.body)
  }
);

export const search = createSimpleAbstractController(
  async (req: Request) => {
    const stringUsername =
      typeof req.query.username === 'string' ? req.query.username : '';
    const stringName = typeof req.query.name === 'string' ? req.query.name : '';
    const stringSurname =
      typeof req.query.surname === 'string' ? req.query.surname : '';
    return await userServices.searchUsers(stringUsername, stringName, stringSurname)
  }
);
