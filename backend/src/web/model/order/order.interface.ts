import {TCargoDTO} from '../../dto/cargo.dto';
import {TDeadline} from '../../dto/deadline.dto';
import {TAddressDTO} from '../../dto/address.dto';

export interface IOrderData {
  clientId: string;
  cargo: TCargoDTO;
  deadline: TDeadline;
  waypoints: {
    points: TAddressDTO[];
    nodes: number[];
  };
  duration: number;
  distance: number;
}

export interface IOrderView {
  clientId: string;
  cargo: TCargoDTO;
  deadline: TDeadline;
  waypoints: {
    points: TAddressDTO[];
  };
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