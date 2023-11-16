import {sameDeadline, TDeadline} from '../../dto/deadline.dto';
import {dataToView, IRouteData, IRouteView} from './route.interface';
import {IOrderView} from '../order/order.interface';
import OrderModel from '../order/order.model';
import {TRouteDTO} from '../../dto/route.dto';
import RouteDb, {IRouteDoc} from '../../db/route.db';

class RouteModel {
  private _invalid = false;
  private _saved = false;
  private _id = '';
  private _complex = false;
  private data: IRouteData | null = null;

  constructor() {
  }

  async createFromDTO(dto: TRouteDTO) {
    this.data = {
      orderIds: [],
      orders: [],
      nodes: [],
      distance: 0,
      clients: dto.clients,
      vanger: dto.vanger,
      time: dto.deadline,
      totalPrice: 0,
    };
    for (let i = 0; i < dto.orders.length; ++i) {
      const order = new OrderModel();
      await order.fromDTO(dto.orders[i]);
      await order.dump();
      if (order.orderData) {
        this.data?.orderIds.push(order.ID);
        this.data?.orders.push(order.orderData);
        this.data.distance += order.orderData.distance;
        this.data.totalPrice += order.orderData.cargo.price;
        this.data.nodes.push(...order.nodes);
      }
    }
    // Create complex
  }

  getIRouteDoc(): IRouteDoc {
    return {
      orders: this.data?.orderIds || [],
      nodes: this.data?.nodes || [],
      distance: this.data?.distance || 0,
      clients: this.data?.clients || [],
      vanger: this.data?.vanger || '',
      time: this.data?.time || {noDeadline: true},
      totalPrice: this.data?.totalPrice || 0,
    };
  }

  fromIRouteData(data: IRouteData) {
    this.data = data;
  }

  async dump() {
    const model = this.getIRouteDoc();
    const m = await RouteDb.create(model);
    this._id = m._id;
    this._saved = true;
  }

  async loadOrders() {
    if (!this.data) return;
    for (let i = 0; i < this.data.orderIds.length; ++i) {
      const orderMongoIndex = this.data.orderIds[i];
      const order = new OrderModel();
      await order.fromId(orderMongoIndex);
      if (order.orderData) {
        this.data.orders.push(order.orderData);
      }
    }
  }

  async fromDoc(doc: IRouteDoc) {
    this.data = {
      orderIds: doc.orders,
      orders: [],
      nodes: doc.nodes,
      distance: doc.distance,
      clients: doc.clients,
      vanger: doc.vanger,
      time: doc.time,
      totalPrice: doc.totalPrice,
    };
    await this.loadOrders();
  }

  async fromId(id: string) {
    this._id = id;
    const doc: IRouteDoc | null | undefined = await RouteDb.findById(id);
    if (doc) {
      await this.fromDoc(doc);
    } else {
      this._invalid = true;
    }
  }

  /*
matchOrder
returns: процент совпадения двух маршрутов
 */
  matchOrder(order: OrderModel): number {
    if (sameDeadline(this.deadline, order.deadline)) {
      // TODO create cool function
      const intersectionSize = (
        new Set([...this.nodes, ...order.nodes])
      ).size;
      return intersectionSize / this.nodes.length;
    }
    return 0;
  }

  /*
  async delete()
  @returns: true, if success
   */
  async delete() {
    try {
      await RouteDb.findByIdAndDelete(this.ID);
      return true;
    } catch (e) {
      return false;
    }
  }

  async update() {
    await RouteDb.findByIdAndUpdate(
      {_id: this.ID},
      this.getIRouteDoc(),
      {upsert: true},
    );
  }

  get deadline(): TDeadline {
    return this.data?.time || {noDeadline: true};
  }

  get orders(): IOrderView[] | null {
    if (!this.data) return null;
    if (!this.data.orders.length) {
      return null;
    }
    return this.data.orders;
  }

  get nodes(): Array<number> {
    return this.data?.nodes || [];
  }

  get ID(): string {
    return this._id;
  }

  get saved(): boolean {
    return this._saved;
  }

  get invalid(): boolean {
    return this._invalid;
  }

  get complex(): boolean {
    return this._complex;
  }

  get outDTO(): IRouteView | null {
    return dataToView(this.data);
  }
}

export default RouteModel;