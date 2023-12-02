import {recoverOrderDTO, TOrderDTO} from '../../dto/order.dto';
import {defaultCargo} from '../../dto/cargo.dto';
import {sameDeadline, TDeadline} from '../../dto/deadline.dto';
import {convertToOSM} from '../../dto/address.dto';
import {RouteData} from '../../../sdk/route_machine_api/types';
import {makeOptimalRoute} from '../../../sdk/route_machine_api';
import OrderDb, {IOrder} from '../../db/order.db';
import {dataToView, IOrderData, IOrderView} from './order.interface';
import {optimizeCoordinates} from '../../../sdk/algo/compare';


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
      cargo: dto.cargo,
      deadline: dto.deadline,
      waypoints: {
        points: dto.waypoints.points,
        nodes: this.optimalRoute?.nodes || [],
        coords: optimizeCoordinates(this.optimalRoute?.coords || [])
      },
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
        coords: this.data?.waypoints.coords || [],
      },
      order: {
        client: this.data?.clientId || '',
        cargo: this.data?.cargo || defaultCargo,
      },
    };
  }

  async dump() {
    const model = this.getIOrderDoc();
    const m = await OrderDb.create(model);
    this.ID = m._id;
    this._saved = true;
  }

  fromDoc(doc: IOrder) {
    this.data = {
      id: '',
      clientId: doc.order.client,
      cargo: doc.order.cargo,
      deadline: doc.time,
      waypoints: {
        points: doc.route.waypoints.points,
        nodes: doc.route.nodes,
        coords: doc.route.coords,
      },
      distance: doc.route.distance,
      duration: doc.route.duration,
    };
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

  /*
  async delete()
  @returns: true, if success
   */
  async delete() {
    try {
      await OrderDb.findByIdAndDelete(this.ID);
      return true;
    } catch (e) {
      return false;
    }
  }

  /*
  matchOrder
  returns: процент совпадения двух маршрутов
   */
  matchOrder(order: OrderModel): number {
    // TODO create cool function
    if (sameDeadline(this.deadline, order.deadline)) {
      const intersectionSize = (
        new Set([...this.nodes, ...order.nodes])
      ).size;
      return intersectionSize / this.nodes.length;
    }
    return 0;
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
}

export default OrderModel;