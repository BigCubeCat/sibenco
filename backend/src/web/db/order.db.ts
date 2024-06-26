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
    nodes: Array<number>;
    coords: string;
    distance: number;
    duration: number;
  };
  order: {
    client: string;
    route: string;
    cargo: TCargoDTO;
  };
  done: boolean;
  isSingle: boolean;
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
  route: {
    waypoints: {
      points: [{
        latitude: {type: String},
        longitude: {type: String},
        address: {type: String},
        OSRMNode: {type: String},
        pointType: {type: String},
        confirmed: {type: Boolean},
      }],
    },
    nodes: [{type: Number}],
    coords: {type: String},
    distance: {type: Number},
    duration: {type: Number},
  },
  order: {
    client: { type: String },
    route: {type: String},
    cargo: {
      unit: {type: String},
      count: {type: Number},
      description: {type: String},
      price: {type: Number},
    },
  },
  done: {type: Boolean},
  isSingle: {type: Boolean}
});
OrderSchema.pre('save', async function(next) {
  this.createdAt = todayDate();
  next();
});
const OrderDb = mongoose.model<TOrderDoc>('OrderDb', OrderSchema);
export default OrderDb;