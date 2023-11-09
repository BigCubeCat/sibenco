import {TOrderDTO} from '../dto/order.dto';
import {TCargoDTO} from '../dto/cargo.dto';
import {TDeadline} from '../dto/deadline.dto';
import {TAddressDTO} from '../dto/address.dto';

interface IOrderData {
  clientId: string;
  cargo: TCargoDTO;
  deadline: TDeadline;
  waypoints: {
    points: TAddressDTO[];
    nodes: string[];
  };
}

class Order {
  private id: string = ''; // MongoID
  private data: IOrderData | null = null;
  private saved: boolean = false;
  private invalid: boolean = false;

  constructor() {
  }

  fromDTO(dto: TOrderDTO) {
    this.data = {
      clientId: dto.clientId,
      cargo: dto.cargo,
      deadline: dto.deadline,
      waypoints: {
        points: dto.waypoints.points,
        nodes: [""], // TODO request
      },
    };
    this.id = '';
  }

  fromId(id: string) {
    this.id = id;
  }
}

export default Order;