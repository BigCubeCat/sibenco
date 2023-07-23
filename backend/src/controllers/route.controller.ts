import { Request, Response } from "express";
import { getErrorMessage } from "../utils/error";
import * as routeService from "../service/route.service";
import { config } from "../config";


export const createRoute = async (req: Request, res: Response) => {
  try {
    const newRoute = await routeService.createRoute(req.body);
    res.status(200).send(newRoute);
  } catch (error) {
    return res.status(500).send(getErrorMessage(error));
  }
}


export const getAll = async (req: Request, res: Response) => {
  try {
    const page: number = (typeof req.query.page == "string") ? Number(req.query.page) : 0;
    const pageSize: number = (typeof req.query.page_size == "string") ? Number(req.query.page_size) : config.PAGE_SIZE;
    const results = await routeService.getAll(page, pageSize);
    res.status(200).send({ results })
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

export const patchRoute = async (req: Request, res: Response) => {
  try {
    const newRoute = await routeService.patchRoute(req.params.id, req.body);
    res.status(200).send(newRoute);
  } catch (error) {
    return res.status(500).send(getErrorMessage(error));
  }
}

export const deleteRoute = async (req: Request, res: Response) => {
  try {
    const newRoute = await routeService.deleteRoute(req.params.id);
    res.status(200).send(newRoute);
  } catch (error) {
    return res.status(500).send(getErrorMessage(error));
  }
}


