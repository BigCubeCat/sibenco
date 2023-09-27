import {Request} from 'express';
import {CustomRequest} from '../middleware/auth';

/*
emailFromToken(req: Request)
@param{req} express Request
parse token and return email from it
@returns token
 */
export const emailFromToken = (req: Request) => {
  const token = (req as CustomRequest).token;
  const tokenStirng = typeof token === 'string' ? token : token?.email;
  return tokenStirng;
};
