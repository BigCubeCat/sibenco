import {Request} from 'express';
import * as userServices from '../service/user.service';
import {CustomRequest} from '../middleware/auth';
import {userWithoutPass} from '../models/user.model';
import {createAbstractController} from "./abstract.controller";

export const createUser = createAbstractController(
  async (req: Request) => {
    const newUser = await userServices.createUser(req.body);
    return {code: 200, body: userWithoutPass(newUser)};
  }
)

export const loginOne = createAbstractController(
  async (req: Request) => {
    return {
      body: await userServices.login(req.body),
      code: 200
    }
  }
);

export const getMe = createAbstractController(
  async (req: Request) => {
    const token = (req as CustomRequest).token;
    const tokenString = typeof token === 'string' ? token : token?.email;
    return {
      body: await userServices.getUser(tokenString),
      code: 200
    };
  }
);

export const getUser = createAbstractController(
  async (req: Request) => {
    return {
      body: await userServices.getOtherUser(req.params.email),
      code: 200
    };
  }
)

export const patchMe = createAbstractController(
  async (req: Request) => {
    const token = (req as CustomRequest).token;
    const tokenString = typeof token === 'string' ? token : token?._id;
    return {
      body: await userServices.patchUser(tokenString, req.body),
      code: 200
    };
  }
);

export const search = createAbstractController(
    async (req: Request) => {
      const stringUsername =
        typeof req.query.username === 'string' ? req.query.username : '';
      const stringName = typeof req.query.name === 'string' ? req.query.name : '';
      const stringSurname =
        typeof req.query.surname === 'string' ? req.query.surname : '';
      return {
        body: await userServices.searchUsers(
          stringUsername,
          stringName,
          stringSurname,
        ), code: 200
      }
    }
  )
;
