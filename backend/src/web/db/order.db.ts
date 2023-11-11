import mongoose from 'mongoose';
import {todayDate} from '../../sdk/utils/date';
import {TDeadline} from '../dto/deadline.dto';
import {TCargoDTO} from '../dto/cargo.dto';
import {TWaypointsDTO} from '../dto/waypoints.dto';

// Database model;
export interface IOrder {
  createdAt?: number;
  time: TDeadline;
  route: {
    waypoints: TWaypointsDTO;
    distance: number;
    duration: number;
  };
  order: {
    client: string;
    cargo: TCargoDTO;
  };
}

export interface TOrderDoc extends IOrder, mongoose.Document {
}

const OrderSchema: mongoose.Schema<TOrderDoc> = new mongoose.Schema({
  createdAt: {type: Number},
  time: {
    noDeadline: {type: Boolean},
    beginDate: {type: Number},
    endDate: {type: Number},
  },
  order: {
    client: {type: String},
    cargo: {
      unit: {type: String},
      count: {type: Number},
      description: {type: String},
      price: {type: Number},
    },
  },
});
OrderSchema.pre('save', async function(next) {
  this.createdAt = todayDate();
  next();
});
const OrderDb = mongoose.model<TOrderDoc>('OrderDb', OrderSchema);
export default OrderDb;