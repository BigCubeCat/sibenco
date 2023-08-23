import mongoose from 'mongoose';

export interface IRouteDoc {
  orders: Array<any>; // TODO rename into orders
  boxes: Array<string>;
  summary_distance: string;
  ts_number: string;
  special_marks: string;
  driver_name: string;
  date: string;
}

export interface I_RouterDocument extends IRouteDoc, mongoose.Document {}

const RouteShema: mongoose.Schema<I_RouterDocument> = new mongoose.Schema({
  orders: [{}], // TODO
  boxes: [{type: String}],
  summary_distance: {type: String},
  ts_number: {type: String},
  special_marks: {type: String},
  driver_name: {type: String},
  date: {type: String},
});

const RouteModel = mongoose.model<I_RouterDocument>('Route', RouteSchema);
export default RouteModel;
