import {TCargoDTO} from './cargo.dto';
import {TWaypointsDTO} from './waypoints.dto';
import {TDeadline} from './deadline.dto';
import {recoverAddress} from './address.dto';

/**
 * @openapi
 * components:
 *  schemas:
 *      OrderDTO:
 *          type: object
 *          required:
 *              - clientId
 *              - routeId
 *              - cargo
 *              - deadline
 *              - waypoints
 *          properties:
 *              clientId:
 *                  type: string
 *                  description: "ID клиента"
 *              routeId:
 *                  type: string
 *                  description: "ID маршрута, которому принадлежит заказ"
 *              cargo:
 *                  type: object
 *                  description: "Кажись тут напартачил со свагером. По сути Cargo это объект типа CargoDTO"
 *                  $ref: '#components/schemas/CargoDTO'
 *              deadline:
 *                  type: object
 *                  description: "DeadLine"
 *                  $ref: '#components/schemas/Deadline'
 *              waypoints:
 *                  type: object
 *                  description: "Остановки"
 *                  $ref: '#components/schemas/WaypointsDTO'
 *              isSingle:
 *                  type: boolean
 *                  description: "Заказ нельзя мержить"
 */
export type TOrderDTO = {
  clientId: string;
  routeId: string;
  cargo: TCargoDTO;
  deadline: TDeadline;
  waypoints: TWaypointsDTO;
  isSingle: boolean;
};

/**
 * @openapi
 * components:
 *  schemas:
 *    Match:
 *      type: object
 *      required:
 *          - ableToMerge
 *          - match
 *      properties:
 *          ableToMerge:
 *              type: boolean
 *              description: "Можно ли соеденить авотматически"
 *          match:
 *              type: number
 *              description: "Процент совпадения"
 */
/**
 * @openapi
 * components:
 *  schemas:
 *    Res:
 *      type: object
 *      required:
 *          - order
 *          - match
 *      properties:
 *          order:
 *              $ref: '#components/schemas/OrderDTO'
 *          match:
 *              $ref: '#components/schemas/Match'
 */

/**
 * @param order
 */

export const recoverOrderDTO = (order: TOrderDTO): TOrderDTO => {
  return {
    clientId: order.clientId,
    routeId: order.routeId,
    cargo: order.cargo,
    deadline: order.deadline,
    waypoints: {
      points: order.waypoints.points.map(
        waypoint => recoverAddress(waypoint)
      ),
      times: order.waypoints.times
    },
    isSingle: order.isSingle
  };
};