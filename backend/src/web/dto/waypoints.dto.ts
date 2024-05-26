import {TAddressDTO} from './address.dto';

/**
 * @openapi
 * components:
 *  schemas:
 *      WaypointsDTO:
 *          type: object
 *          required:
 *              - points
 *              - times
 *          properties:
 *              points:
 *                  type: array
 *                  description: "Остановки"
 *                  items:
 *                      $ref: '#components/schemas/AddressDTO'
 *              times:
 *                  type: array
 *                  description: "Времена остановок"
 *                  items:
 *                      type: number
 *                      format: unix-time
 *
 */
export type TWaypointsDTO = {
  points: TAddressDTO[],
  times: number[]
};


