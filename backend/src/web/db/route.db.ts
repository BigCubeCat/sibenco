import mongoose from 'mongoose';
import {TDeadline} from '../dto/deadline.dto';

export interface IRouteDoc {
  orders: Array<string>; // Список id заказов, ибо заказ может обновиться
  nodes: Array<number>;
  distance: number;
  clients: Array<string>; // Список id клиентов
  vanger: string;
  time: TDeadline;
  totalPrice: number;
}

export interface I_RouterDocument extends IRouteDoc, mongoose.Document {
}

const RouteSchema: mongoose.Schema<I_RouterDocument> = new mongoose.Schema({
  orders: [{type: String}],
  nodes: [{type: Number}],
  distance: {type: Number},
  clients: [{type: String}],
  vanger: {type: String},
  time: {
    noDeadline: {type: Boolean},
    beginDate: {type: Number},
    endDate: {type: Number},
  },
  totalPrice: {type: Number},
});

const RouteDb = mongoose.model<I_RouterDocument>('Route', RouteSchema);
export default RouteDb;