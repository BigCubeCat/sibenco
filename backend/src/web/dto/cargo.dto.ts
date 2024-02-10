import { TFreightDTO } from "./freight.dto";
import { TPassengerDTO } from "./passenger.dto";

/**
 * @openapi
 * components:
 *  schemas:
 *      CargoDTO:
 *          type: object
 *          required:
 *              - unit
 *              - numberOfPassengersInCar
 *              - amountOfCargoInCar
 *              - description
 *          properties:
 *              unit:
 *                  type: string
 *                  description: "Тип перевозки.\nhuman - человек\ncargo - товар\nall-и люди, и товар"
 *                  enum:
 *                    - human
 *                    - cargo
 *                    - all
 *              numberOfPassengersInCar:
 *                  type: number
 *                  description: "Число пассажиров"
 *                  format: int64
 *              amountOfCargoInCar:
 *                  type: number
 *                  description: "Число груза"
 *                  format: float
 *              passengers:
 *                  type: array
 *                  description: "Пассажиры"
 *                  items:
 *                      $ref: '#components/schemas/'
 *              department:
 *                  type: string
 *                  description: "Стуктурное подразделение"
 *              description:
 *                  type: string
 *                  description: "Описание"
 */
export type TCargoDTO = {
  unit: 'human' | 'cargo' | 'all';
  numberOfPassengersInCar: number;
  amountOfCargoInCar: number;
  passengers: Array<TPassengerDTO>;
  freights: Array<TFreightDTO>;
  department: string; 
  description: string;
};

export const defaultCargo: TCargoDTO = {
  unit: 'all',
  numberOfPassengersInCar: 0,
  amountOfCargoInCar: 0,
  passengers: [],
  freights: [],
  department: 'отсутсвует',
  description: ''
};
