import mongoose from "mongoose";

export interface IRouteDoc {
  points: Array<string>; // TODO 
  summaryDistance: string;
  tsNumber: string;
  driverName: string;
}

export interface I_RouterDocument extends IRouteDoc, mongoose.Document { }

const RouteShema: mongoose.Schema<I_RouterDocument> = new mongoose.Schema({
  points: [{ type: String }],
  summaryDistance: { type: String },
  tsNumber: { type: String },
  driverName: { type: String }
});

const RouteModel = mongoose.model<I_RouterDocument>("Route", RouteShema);
export default RouteModel;

