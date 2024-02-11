import {TCarDTO} from "./car.dto";
import {TDriverDTO} from "./driver.dto";

export type TVangerDTO = {
  id: string;
  car: TCarDTO;
  Driver: TDriverDTO;
  timeBegin: number;
  timeEnd: number;
}