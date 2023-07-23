import { Request, Response } from "express";
import { getErrorMessage } from "../utils/error";
import * as routeService from "../service/route.service";


export const createRoute = async (req: Request, res: Response) => {
  try {
    const newRoute = await routeService.createRoute(req.body);
    res.status(200).send(newRoute);
  } catch (error) {
    return res.status(500).send(getErrorMessage(error));
  }
}

export const getRoute = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id ? req.params.id : "";
    if (id == "") {
      return res.status(400).send(getErrorMessage(new Error("Bad id")))
    }
    const foundRoute = await routeService.getRoute(id);
    res.status(200).send(foundRoute);
  } catch (error) {
    return res.status(500).send(getErrorMessage(error));
  }
}
