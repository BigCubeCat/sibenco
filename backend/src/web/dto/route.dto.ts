import {TDeadline} from './deadline.dto';
import {TWaypointsDTO} from './waypoints.dto';
import {TOrderDTO} from './order.dto';


/**
 * @openapi
 * components:
 *  schemas:
 *      RouteDTO:
 *          type: object
 *          required:
 *              - orders
 *              - waypoints
 *              - deadline
 *              - clients
 */
export type TRouteDTO = {
  orders: TOrderDTO[];
  waypoints: TWaypointsDTO;
  deadline: TDeadline;
  clients: Array<string>,
  vangerId: string;
};