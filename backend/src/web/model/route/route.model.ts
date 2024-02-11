import {sameDeadline, TDeadline} from '../../dto/deadline.dto';
import {dataToView, IRouteData, IRouteView} from './route.interface';
import {IOrderView} from '../order/order.interface';
import OrderModel from '../order/order.model';
import {TRouteDTO} from '../../dto/route.dto';
import RouteDb, {IRouteDoc} from '../../db/route.db';
import {TWaypointsDTO} from '../../dto/waypoints.dto';
import {getSuitableVanger} from '../../../conn/vangers/vangers.conn';
import {TVangerDTO} from '../../dto/vanger.dto';
import { TLocationDTO } from '../../dto/location.dto';

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
      id: '',
      orderIds: [],
      orders: [],
      waypoints: dto.waypoints,
      nodes: [],
      distance: 0,
      clients: dto.clients,
      done: this.done,
      active: this.active,
      vanger: dto.vangerId,
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

  async createFromOrderID(orderID: string) {
    console.log("    async createFromOrderID(orderID: string) ");
    const mainOrderModel: OrderModel = new OrderModel();
    await mainOrderModel.fromId(orderID);
    const latitude: string | undefined = mainOrderModel.points[0].latitude;
    const longitude: string | undefined = mainOrderModel.points[0].longitude;

    if (!latitude || !longitude) {
      this._invalid = true;
      return;
    }

    const location: TLocationDTO = {
      latitude: latitude,
      longitude: longitude
    };

    const vanger: TVangerDTO | undefined = await getSuitableVanger(mainOrderModel.cargo, mainOrderModel.deadline, location);
    let vangerId: string;

    if (!vanger) {
        vangerId = '0';
    } else {
      vangerId = vanger.id;
    }

    if (mainOrderModel.invalid || mainOrderModel.orderData == null) {
      this._invalid = true;
      return;
    }

    this.data = {
      id: '',
      orderIds: [orderID],
      orders: [mainOrderModel.orderData],
      waypoints: {points: mainOrderModel.orderData.waypoints.points},
      nodes: mainOrderModel.nodes,
      distance: mainOrderModel.orderData.distance,
      clients: [mainOrderModel.orderData.clientId],
      done: mainOrderModel.done,
      active: false,
      vanger: vangerId, //очень нужнна связь с сервисом водителей
      time: mainOrderModel.deadline,
      totalPrice: mainOrderModel.orderData.cargo.price, // price никому не нужен, это поле надо удалить
    };

  }

  getIRouteDoc(): IRouteDoc {
    return {
      orders: this.data?.orderIds || [],
      waypoints: this.data?.waypoints || {points: []},
      nodes: this.data?.nodes || [],
      distance: this.data?.distance || 0,
      clients: this.data?.clients || [],
      done: this.data?.done || false,
      active: this.data?.active || false,
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
    this.ID = m._id.toString();
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
      id: '',
      orderIds: doc.orders,
      orders: [],
      waypoints: doc.waypoints,
      nodes: doc.nodes,
      distance: doc.distance,
      clients: doc.clients,
      done: doc.done,
      active: doc.active,
      vanger: doc.vanger,
      time: doc.time,
      totalPrice: doc.totalPrice,
    };
    await this.loadOrders();
  }

  async fromId(id: string) {
    const doc: IRouteDoc | null | undefined = await RouteDb.findById(id);
    if (doc) {
      await this.fromDoc(doc);
    } else {
      this._invalid = true;
    }
    this.ID = id;
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

  async setVangerId(vangerId: string) {
    if (!this.data) {
      this.saved = false;
      return;
    }
    this.data.vanger = vangerId;
    return await this.update();
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

  get ordersIds(): Array<string> {
    if (!this.data) return [];
    if (!this.data.orders.length) {
      return [];
    }
    return this.data.orderIds;
  }

  get nodes(): Array<number> {
    return this.data?.nodes || [];
  }

  get ID(): string {
    return this._id;
  }

  set ID(id: string) {
    this._id = id;
    if (this.data) {
      this.data.id = id;
    }
  }

  get saved(): boolean {
    return this._saved;
  }

  set saved(value: boolean) {
    this._saved = value;
  }

  get invalid(): boolean {
    return this._invalid;
  }

  get complex(): boolean {
    return this._complex;
  }

  get vanger(): string | undefined {
    return this.data?.vanger;
  }

  get outDTO(): IRouteView | null {
    return dataToView(this.data);
  }

  get stopPoints(): TWaypointsDTO {
    return this.data?.waypoints || {points: []};
  }

  set setInvalid(isInvalid: boolean) {
    this._invalid = isInvalid;
  }

  set done(value: boolean) {
    if (this.data) {
      this.data.done = value;
    }
  }

  get done(): boolean {
    return this.data?.done || false;
  }

  set active(value: boolean) {
    if (this.data) {
      this.data.active = value;
    }
  }

  get active(): boolean {
    return this.data?.active || false;
  }

}

export default RouteModel;

// TODO
// Надо добавить выбор вангера при создании маршрута по заказу