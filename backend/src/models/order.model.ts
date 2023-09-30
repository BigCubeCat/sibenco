import mongoose from 'mongoose';
import { todayDate } from '../utils/date';

export interface IAddressDto {
  address: string;
  latitude: string;
  longitude: string;
  word: string;
}

export interface IPassanger {
  fullName: string;
  phoneNumber: string;
}

interface IOrder {
  date: {
    createdAt: number; // Дата создания unix-time
    loadingTime: number; // Дата исполнения
    unloadingTime: number;
    loadingWaiting: number;
    unloadingWaiting: number;
  };
  route: {
    loadingAddress: IAddressDto;
    unloadingAddress: IAddressDto;
    distance: string;
  };
  order: {
    typeOfTransportation: string;
    devisionName: string;
    client: string;
    passengers: Array<IPassanger>;
  };
}

export interface TOrderDoc extends IOrder, mongoose.Document { }

const OrderSchema: mongoose.Schema<TOrderDoc> = new mongoose.Schema({
  date: {
    createdAt: { type: Number }, // Создается автоматически
    loadingTime: { type: Number },
    unloadingTime: { type: Number },
    loadingWaiting: { type: Number },
    unloadingWaiting: { type: Number }
  },
  route: {
    loadingAddress: {
      address: { type: String },
      latitude: { type: String },
      longitude: { type: String },
      word: { type: String },
    },
    unloadingAddress: {
      address: { type: String },
      latitude: { type: String },
      longitude: { type: String },
      word: { type: String },
    },
    distance: { type: String }, // Считаем на бэке
  },
  order: {
    typeOfTransportation: { type: String },
    devisionName: { type: String },
    client: { type: String },
    passengers: [{ fullName: { type: String }, phoneNumber: { type: String } }]
  },
});
OrderSchema.pre('save', async function (next) {
  this.date.createdAt = todayDate();
  next();
});
const OrderModel = mongoose.model<TOrderDoc>('OrderModel', OrderSchema);
export default OrderModel;