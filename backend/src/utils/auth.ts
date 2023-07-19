import { Request } from "express";
import { CustomRequest } from "../middleware/auth";

export const getStringToken = (req: Request) => {
  const token = (req as CustomRequest).token;
  const tokenStirng = typeof token === "string" ? token : token?.username;
  return tokenStirng;
};
