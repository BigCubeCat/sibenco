import mongoose from 'mongoose';
import {TDeadline} from '../dto/deadline.dto';
import { TWaypointsDTO } from '../dto/waypoints.dto';

export interface IRouteDoc {
  orders: Array<string>; // Список id заказов, ибо заказ может обновиться
  waypoints: TWaypointsDTO;
  nodes: Array<number>;
  distance: number;
  clients: Array<string>; // Список id клиентов
  done: boolean;
  active: boolean;
  vanger: string;
  time: TDeadline;
}

export interface I_RouterDocument extends IRouteDoc, mongoose.Document {
}

const RouteSchema: mongoose.Schema<I_RouterDocument> = new mongoose.Schema({
  orders: [{ type: String }],
  waypoints: {
    points: [{
      latitude: { type: String },
      longitude: { type: String },
      address: { type: String },
      city: {type: String},
      OSRMNode: { type: String },
      pointType: { type: String },
      confirmed: { type: Boolean },
    }],
    times: [{type: Number}],
  },
  nodes: [{type: Number}],
  distance: {type: Number},
  clients: [{ type: String }],
  done: { type: Boolean },
  active: {type: Boolean},
  vanger: {type: String},
  time: {
    noDeadline: {type: Boolean},
    beginDate: {type: Number},
    endDate: {type: Number},
  },
});

const RouteDb = mongoose.model<I_RouterDocument>('Route', RouteSchema);
export default RouteDb;