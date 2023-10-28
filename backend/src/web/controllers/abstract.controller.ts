import {Request, Response} from "express";
import {getErrorMessage} from "../../sdk/utils/error";

type TResponse = {
  code: number,
  body: any,
}

/*
createAbstractController
get controller-function.
If success, set 200 status code and send result of function.
Else set status 500 and send error message.
 */
export function createAbstractController(
  controller: (req: Request, res: Response) => Promise<TResponse>
) {
  return async (req: Request, res: Response) => {
    try {
      const result = await controller(req, res);
      res.status(result.code || 200).send(result.body);
    } catch (error) {
      return res.status(500).send(getErrorMessage(error));
    }
  };
}
