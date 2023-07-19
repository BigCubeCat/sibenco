import { Request } from "express";
import { CustomRequest } from "../middleware/auth";

export const emailFromToken = (req: Request) => {
  const token = (req as CustomRequest).token;
  const tokenStirng = typeof token === "string" ? token : token?.email;
  return tokenStirng;
};
