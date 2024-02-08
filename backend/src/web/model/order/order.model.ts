import {recoverOrderDTO, TOrderDTO} from '../../dto/order.dto';
import {defaultCargo, TCargoDTO} from '../../dto/cargo.dto';
import {TDeadline} from '../../dto/deadline.dto';
import {convertToOSM, getPointsCoords, TAddressDTO} from '../../dto/address.dto';
import {RouteData} from '../../../sdk/route_machine_api/types';
import {makeOptimalRoute} from '../../../sdk/route_machine_api';
import OrderDb, {IOrder} from '../../db/order.db';
import {dataToView, IOrderData, IOrderView} from './order.interface';
import {createCoords, getRedisKey} from '../../../sdk/algo/coords';
import getRedisClient from "../../../conn/cache/redis.conn";


class OrderModel {
  private id: string = ''; // MongoID
  private data: IOrderData | null = null;
  private _saved: boolean = false;
  private _invalid: boolean = false;
  private optimalRoute: RouteData | undefined;

  constructor() {
  }

  async fromDTO(dto: TOrderDTO) {
    // По сути это создание нашего заказа. Все остальные - from... -
    // Восстановление данных из другого формата.
    // Восстанавливаем адреса.
    const recoveredDto = recoverOrderDTO(dto);
    // Вот тут this.data остается null
    this.optimalRoute = await makeOptimalRoute(
      recoveredDto.waypoints.points.map(
        point => convertToOSM(point),
      ),
    );

    this.data = {
      id: '',
      clientId: dto.clientId,
      routeId: dto.routeId,
      cargo: dto.cargo,
      deadline: dto.deadline,
      waypoints: {
        points: dto.waypoints.points,
        nodes: this.optimalRoute?.nodes || [],
        coords: createCoords(
          this.optimalRoute?.coords || [],
          dto.waypoints.points.map(point => getPointsCoords(point))
        )
      },
      isSingle: dto.isSingle,
      done: this.done,
      distance: this.optimalRoute?.distance || 0,
      duration: this.optimalRoute?.duration || 0,
    };

    this.ID = '';
    this._saved = false;
  }

  fromIOrderData(order: IOrderData) {
    this.data = order;
  }

  getIOrderDoc(): IOrder {
    return {
      time: this.data?.deadline || {noDeadline: true},
      route: {
        waypoints: {points: this.data?.waypoints.points || []},
        distance: this.data?.distance || 0,
        duration: this.data?.duration || 0,
        nodes: this.data?.waypoints.nodes || [],
        coords: this.data?.waypoints.coords || "0,0,oon",
      },
      order: {
        client: this.data?.clientId || '',
        route: this.data?.routeId || '',
        cargo: this.data?.cargo || defaultCargo,
      },
      done: this.done,
      isSingle: this.data?.isSingle || false
    };
  }

  async dump() {
    const model = this.getIOrderDoc();
    const m = await OrderDb.create(model);
    this.ID = m._id.toString();
    this._saved = true;
    await this.cacheOrder();
  }

  fromDoc(doc: IOrder) {
    this.data = {
      id: '',
      clientId: doc.order.client,
      routeId: doc.order.route,
      cargo: doc.order.cargo,
      deadline: doc.time,
      waypoints: {
        points: doc.route.waypoints.points,
        nodes: doc.route.nodes,
        coords: doc.route.coords,
      },
      done: doc.done, // TODO fix it
      isSingle: doc.isSingle,
      distance: doc.route.distance,
      duration: doc.route.duration,
    };
    this.done = doc.done;
  }

  async update() {
    await OrderDb.findByIdAndUpdate(
      {_id: this.ID},
      this.getIOrderDoc(),
      {upsert: true},
    );
  }

  async fromId(id: string) {
    const doc: IOrder | null | undefined = await OrderDb.findById(id);
    if (doc) {
      this.fromDoc(doc);
    } else {
      this._invalid = true;
    }
    this.ID = id;
  }

  /**
   * cacheOrder()
   * Add this order to cache
   */
  async cacheOrder() {
    const redisConn = await getRedisClient();
    if (!redisConn.isConnected) {
      console.error("Cant add ", this.ID, " to cache");
    }
    for (let i = 0; i < Number(this.data?.waypoints.points.length); ++i) {
      const point = this.data?.waypoints.points[i];
      if (!point) break;
      const key = getRedisKey(
        {lat: Number(point.latitude), lon: Number(point.longitude), type: 'n'}
      ); // тут ненужен pointType
      await redisConn.appendByKey(key, this.ID);
    }
  }

  async deleteOrderCache() {
    const keys = this.points.map(point => getRedisKey({
      lat: Number(point.latitude), lon: Number(point.longitude), type: 'n'
    }));
    const redisConn = await getRedisClient();
    if (!redisConn.isConnected) {
      console.error("cant connect redis");
      return;
    }
    for (let i = 0; i < keys.length; ++i) {
      await redisConn.deleteByKey(keys[i], this.ID);
    }
  }

  async setDone() {
    this.done = true;
    await this.deleteOrderCache();
    await this.dump();
  }

  /*
  async delete()
  @returns: true, if success
   */
  async delete() {
    try {
      await OrderDb.findByIdAndDelete(this.ID);
      await this.deleteOrderCache();
      return true;
    } catch (e) {
      return false;
    }
  }

  get deadline(): TDeadline {
    return this.data?.deadline || {noDeadline: true};
  }

  get nodes(): Array<number> {
    return this.data?.waypoints.nodes || [];
  }

  get saved(): boolean {
    return this._saved;
  }

  get invalid(): boolean {
    return this._invalid;
  }

  get ID(): string {
    return this.id;
  }

  set ID(_id: string) {
    this.id = _id;
    if (this.data)
      this.data.id = _id;
  }

  get orderData(): IOrderData | null {
    return this.data;
  }

  get outDTO(): IOrderView | null {
    return dataToView(this.data);
  }

  get boxes(): string {
    return this.data?.waypoints.coords || "";
  }

  get points(): TAddressDTO[] {
    return this.data?.waypoints.points || [];
  }

  set done(value: boolean) {
    if (this.data) {
      this.data.done = value;
    }
  }

  get done(): boolean {
    return this.data?.done || false;
  }

  set route(_id: string) {
    if (this.data) {
      this.data.routeId = _id;
    }
  }

  get route(): string {
    return this.data?.routeId || "";
  }
  
  get noDeadline(): boolean {
    return this.data?.deadline.noDeadline || false;
  }

  get cargo(): TCargoDTO {
    return this.data?.cargo || defaultCargo
  }

}

export default OrderModel;