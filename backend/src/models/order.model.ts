import mongoose from 'mongoose';

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

const OrderModel = mongoose.model<TOrderDoc>('OrderModel', OrderSchema);
export default OrderModel;
