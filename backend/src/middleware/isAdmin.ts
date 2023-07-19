import { Request, Response, NextFunction } from "express";
import { emailFromToken } from "../utils/auth";
import { config } from "../config";


export const isAdminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (emailFromToken(req) != config.admin.email) {
      throw new Error();
    }
    next();
  } catch (err) {
    res.status(401).send("Please authenticate");
  }
};
