import {NextFunction, Request, Response} from 'express';
// import {emailFromToken} from '../utils/auth';
// import * as userService from '../service/user.service';
import {TRole} from '../models/user.model';

export function roleMiddleware(roles: TRole[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    next();
    return;
    /*
    try {
      const email = emailFromToken(req);
      const user = await userService.getOtherUser(email);
      if (!roles.includes(user.role)) {
        res.status(401).send('Please authenticate');
        return;
      }
      next();
    } catch (err) {
      res.status(401).send('Please authenticate');
    }
     */
  };
}

export const isDriver = roleMiddleware(['driver']);
export const isAxo = roleMiddleware(['axo']);
export const isEmployee = roleMiddleware(['employee']);
