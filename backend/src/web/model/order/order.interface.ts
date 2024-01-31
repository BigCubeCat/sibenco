import {TCargoDTO} from '../../dto/cargo.dto';
import {TDeadline} from '../../dto/deadline.dto';
import {TAddressDTO} from '../../dto/address.dto';
import {TWaypointsDTO} from "../../dto/waypoints.dto";

export interface IOrderData {
  id: string;
  clientId: string;
  cargo: TCargoDTO;
  deadline: TDeadline;
  waypoints: {
    points: TAddressDTO[];
    nodes: number[];
    coords: string;
  };
  done: boolean;
  isSingle: boolean;
  duration: number;
  distance: number;
}

/**
 * @openapi
 * components:
 *  schemas:
 *      OrderView:
 *          type: object
 *          required:
 *              - id
 *              - clientId
 *              - cargo
 *              - deadline
 *              - waypoints
 *              - duration
 *              - distance
 *          properties:
 *              id:
 *                  type: string
 *                  description: "Уникальный идентификатор заказа"
 *              clientId:
 *                  type: string
 *                  description: "Иденитфикатор клиента"
 *              cargo:
 *                  type: object
 *                  oneOf:
 *                      - $ref: '#components/schemas/CargoDTO'
 *              deadline:
 *                  type: object
 *                  description: "Дедлайн"
 *                  oneOf:
 *                      - $ref: '#components/schemas/Deadline'
 *              waypoints:
 *                  type: object
 *                  description: "Остановки"
 *                  oneOf:
 *                      - $ref: '#components/schemas/WaypointsDTO'
 *              duration:
 *                  type: number
 *                  description: "Длительность поездки"
 *              distance:
 *                  type: number
 *                  description: "Дистанция маршрута"
 */
export interface IOrderView {
  id: string;
  clientId: string;
  cargo: TCargoDTO;
  deadline: TDeadline;
  waypoints: TWaypointsDTO;
  done: boolean;
  isSingle: boolean;
  duration: number;
  distance: number;
}

export const dataToView = (order: IOrderData | null) => {
  if (order)
    return {
      ...order, waypoints: {
        points: order.waypoints.points,
      },
    };
  return null;
};