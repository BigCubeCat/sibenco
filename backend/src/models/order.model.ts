import mongoose from 'mongoose';
import {todayDate} from '../utils/date';

export interface IAddressDto {
  address: string;
  latitude: string;
  longitude: string;
  word: string;
}

interface IOrder {
  date: {
    createdAt: string; // Дата создания
    executionAt: string; // Дата исполнения
  };
  route: {
    loadingAddress: IAddressDto;
    unloadingAddress: IAddressDto;
    distance: string;
  };
  order: {
    typeOfTransportation: string;
    cargoName: string;
    specialMarks: string;
    client: string;
  };
}

export interface TOrderDoc extends IOrder, mongoose.Document {
}

const OrderSchema: mongoose.Schema<TOrderDoc> = new mongoose.Schema({
  date: {
    createdAt: {type: String}, // Создается автоматически
    executionAt: {type: String, required: true},
  },
  route: {
    loadingAddress: {
      address: {type: String},
      latitude: {type: String},
      longitude: {type: String},
      word: {type: String}
    },
    unloadingAddress: {
      address: {type: String},
      latitude: {type: String},
      longitude: {type: String},
      word: {type: String}
    },
    distance: {type: String}, // Считаем на бэке
  },
  order: {
    typeOfTransportation: {type: String, required: true},
    cargoName: {type: String, required: true},
    specialMarks: {type: String, required: true},
    client: {type: String},
  },
});
OrderSchema.pre('save', async function (next) {
  this.date.createdAt = todayDate();
  next();
});
const OrderModel = mongoose.model<TOrderDoc>('OrderModel', OrderSchema);
export default OrderModel;
