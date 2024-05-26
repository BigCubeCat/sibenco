import {TAddressDTO} from './address.dto';

/**
 * @openapi
 * components:
 *  schemas:
 *      WaypointsDTO:
 *          type: object
 *          required:
 *              - points
 *          properties:
 *              points:
 *                  type: array
 *                  description: "Остановки"
 *                  items:
 *                      $ref: '#components/schemas/AddressDTO'
 *
 */
export type TWaypointsDTO = {
  points: TAddressDTO[],
};


