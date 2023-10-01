import mongoose from 'mongoose';

export interface IRouteDoc {
  route: {
    orders: Array<string>; // Список id заказов, ибо заказ может обновиться
    boxes: Array<string>;
    distance: string;
  };
  car: {
    tsNumber: string;
    specialMarks: string;
    driver: string;
    loadCapacity: number;
    numberOfSeats: number;
  };
  date: number;
  status: string;
  isPrivate: boolean;
  isSingle: boolean;
  cargoInRoute: number;
  passengersInRoute: number;
  comment: string;
}

export interface I_RouterDocument extends IRouteDoc, mongoose.Document { }

const RouteSchema: mongoose.Schema<I_RouterDocument> = new mongoose.Schema({
  route: {
    orders: [{ type: String }],
    boxes: [{ type: String }],
    distance: { type: String }
  },
  car: {
    tsNumber: { type: String },
    specialMarks: { type: String },
    driver: { type: String },
    loadCapacity: { type: Number },
    numberOfSeats: { type: Number }
  },
  date: { type: Number },
  status: { type: String },
  isPrivate: { type: Boolean },
  isSingle: { type: Boolean },
  cargoInRoute: { type: Number },
  passengersInRoute: { type: Number },
  comment: { type: String }
});

const RouteModel = mongoose.model<I_RouterDocument>('Route', RouteSchema);
export default RouteModel;