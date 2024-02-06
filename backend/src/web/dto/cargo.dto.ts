/**
 * @openapi
 * components:
 *  schemas:
 *      CargoDTO:
 *          type: object
 *          required:
 *              - unit
 *              - count
 *              - description
 *              - price
 *          properties:
 *              unit:
 *                  type: string
 *                  description: "Тип перевозки.\npeople - человек\ngood - товар"
 *                  enum:
 *                    - people
 *                    - good
 *              numberOfPassengersInCar:
 *                  type: number
 *                  description: "Число пассажиров"
 *                  format: int64
 *              amountOfCargoInCar:
 *                  type: number
 *                  description: "Число груза"
 *                  format: float
 *              description:
 *                  type: string
 *                  description: "Просто описание"
 *              price:
 *                  type: number
 *                  description: "Цена груза"
 */
export type TCargoDTO = {
  unit: 'human' | 'cargo' | 'all';
  numberOfPassengersInCar: number;
  amountOfCargoInCar: number;
  description: string;
  price: number;
};

export const defaultCargo: TCargoDTO = {
  unit: 'all',
  numberOfPassengersInCar: 0,
  amountOfCargoInCar: 0,
  description: '',
  price: 0,
};