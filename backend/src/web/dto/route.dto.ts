import {TDeadline} from './deadline.dto';
import {TWaypointsDTO} from './waypoints.dto';
import {TOrderDTO} from './order.dto';

export type TRouteDTO = {
  orders: TOrderDTO[];
  waypoints: TWaypointsDTO;
  deadline: TDeadline;
  clients: Array<string>,
  vanger: string;
};