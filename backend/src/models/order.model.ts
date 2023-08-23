import mongoose from 'mongoose';
import { createRoute } from '../service/route.service';
import {I_RouterDocument} from '../models/route.model';

interface TOrder {
  typeOfTransportation: string;
  date: string; // TODO Date
  loadingAddress: string;
  unloadingAddress: string;
  cargoName: string;
  distance: string;
  specialMarks: string;
  client: string;
}

export interface TOrderDoc extends TOrder, mongoose.Document {}

const OrderSchema: mongoose.Schema<TOrderDoc> = new mongoose.Schema({
  typeOfTransportation: {
    type: String,
    unique: false,
    required: true,
  },
  date: {
    type: String,
    unique: false,
    required: true,
  },
  loadingAddress: {
    type: String,
    unique: false,
    required: true,
  },
  unloadingAddress: {
    type: String,
    unique: false,
    required: true,
  },
  cargoName: {
    type: String,
    unique: false,
    required: true,
  },
  distance: {
    type: String,
    unique: false,
    required: true,
  },
  specialMarks: {
    type: String,
    unique: false,
    required: false,
  },
  client: {
    type: String,
    unique: false,
    require: true,
  },
});

OrderSchema.pre("save", async function(next) {
  const array = [this];
  const route = {
    orders: array,
    summary_distance: this.distance,
    ts_number: "",
    special_marks: "",
    driver_name: "",
    date: this.date,
  };
  await createRoute(<I_RouterDocument>route);
  next();
});

const OrderModel = mongoose.model<TOrderDoc>('OrderModel', OrderSchema);
export default OrderModel;
