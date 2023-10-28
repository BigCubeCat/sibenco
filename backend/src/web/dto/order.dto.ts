import {TCargoDTO} from './cargo.dto';
import {TWaypointsDTO} from './waypoints.dto';
import {TDeadline} from './deadline.dto';
import {recoverAddress} from './address.dto';

export type TOrderDTO = {
  clientId: string;
  cargo: TCargoDTO;
  deadline: TDeadline;
  waypoints: TWaypointsDTO;
};

export const recoverOrderDTO = (order: TOrderDTO): TOrderDTO => {
  return {
    clientId: order.clientId,
    cargo: order.cargo,
    deadline: order.deadline,
    waypoints: {
      points: order.waypoints.points.map(
        waypoint => recoverAddress(waypoint),
      ),
    },
  };
};