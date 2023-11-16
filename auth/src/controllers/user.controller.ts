import {Request, Response} from "express";
import axios from "axios";
import {redirectedUrl} from "../utils/redirect";

export const get = async (req: Request, res: Response) => {
  const url = redirectedUrl(req.url);
  console.log(url);
  try {
    const result = await axios.get(url, req.body);
    console.log(result);
    res.status(result.status).send(result.data);
  } catch (error) {
    return res.status(400).send(error);
  }
}
export const post = async (req: Request, res: Response) => {
  const url = redirectedUrl(req.url);
  try {
    const result = await axios.post(url, req.body);
    res.status(result.status).send(result.data);
  } catch (error) {
    return res.status(400).send(error);
  }
}
export const patch = async (req: Request, res: Response) => {
  const url = redirectedUrl(req.url);
  try {
    const result = await axios.patch(url, req.body);
    res.status(result.status).send(result.data);
  } catch (error) {
    return res.status(500).send("Error in auth");
  }
}
export const deleteMethode = async (req: Request, res: Response) => {
  const url = redirectedUrl(req.url);
  try {
    const result = await axios.delete(url);
    res.status(result.status).send(result.data);
  } catch (error) {
    return res.status(500).send("Error in auth");
  }
}