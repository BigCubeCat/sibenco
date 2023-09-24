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
  };
  date: string;
  status: string;
}

export interface I_RouterDocument extends IRouteDoc, mongoose.Document {}

const RouteSchema: mongoose.Schema<I_RouterDocument> = new mongoose.Schema({
  route: {
    orders: [{type: String}],
    boxes: [{type: String}],
    distance: String,
  },
  car: {
    tsNumber: {type: String},
    specialMarks: {type: String},
    driver: {type: String},
  },
  date: {type: String},
  status: {type: String},
});

const RouteModel = mongoose.model<I_RouterDocument>('Route', RouteSchema);
export default RouteModel;
