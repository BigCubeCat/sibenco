import {TCarDTO} from "./car.dto";
import {TDriverDTO} from "./driver.dto";

export type TVangerDTO = {
  id: string;
  Car: TCarDTO;
  Driver: TDriverDTO;
  timeBegin: number;
  timeEnd: number;
}