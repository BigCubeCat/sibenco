import {recoverOrderDTO, TOrderDTO} from '../dto/order.dto';
import {defaultCargo, TCargoDTO} from '../dto/cargo.dto';
import {TDeadline} from '../dto/deadline.dto';
import {TAddressDTO, convertToOSM} from '../dto/address.dto';
import {RouteData} from '../../sdk/route_machine_api/types';
import {makeOptimalRoute} from '../../sdk/route_machine_api';
import OrderDb, {IOrder} from '../db/order.db';

interface IOrderData {
  clientId: string;
  cargo: TCargoDTO;
  deadline: TDeadline;
  waypoints: {
    points: TAddressDTO[];
    nodes: number[];
  };
  duration: number;
  distance: number;
}

class Order {
  private id: string = ''; // MongoID
  private data: IOrderData | null = null;
  private _saved: boolean = false;
  private _invalid: boolean = false;
  private optimalRoute: RouteData | undefined;

  constructor() {
  }

  fromDTO(dto: TOrderDTO) {
    // Восстанавливаем адреса.
    const recoveredDto = recoverOrderDTO(dto);
    const fetchMakeOptimalRoute = async () => {
      return await makeOptimalRoute(recoveredDto.waypoints.points.map(
        point => convertToOSM(point),
      ));
    };
    fetchMakeOptimalRoute().then(res => this.optimalRoute = res);

    this.data = {
      clientId: dto.clientId,
      cargo: dto.cargo,
      deadline: dto.deadline,
      waypoints: {
        points: dto.waypoints.points,
        nodes: this.optimalRoute?.nodes || [],
      },
      distance: this.optimalRoute?.distance || 0,
      duration: this.optimalRoute?.duration || 0,
    };
    this.id = '';
    this.saved = false;
  }

  getIOrderDoc(): IOrder {
    return {
      time: this.data?.deadline || {noDeadline: true},
      route: {
        waypoints: this.data?.waypoints || {points: []},
        distance: this.data?.distance || 0,
        duration: this.data?.duration || 0,
      },
      order: {
        client: this.data?.clientId || '',
        cargo: this.data?.cargo || defaultCargo,
      },
    };
  }

  dump() {
    const model = this.getIOrderDoc();
    const fetchDb = async () => {
      const m = await OrderDb.create(model);
      this.id = m._id;
    };
    fetchDb().catch();
    this._saved = true;
  }

  fromDoc(doc: IOrder) {

  }

  fromId(id: string) {
    this.id = id;
    const fetchDb = async () => {
      const doc: IOrder | null | undefined = await OrderDb.findById(id);
      if (doc) {
        this.fromDoc(doc);
      } else {
        this._invalid = true;
      }
    };
    fetchDb().catch();
  }

  get saved(): boolean {
    return this._saved;
  }

  get invalid(): boolean {
    return this._invalid;
  }
}

export default Order;