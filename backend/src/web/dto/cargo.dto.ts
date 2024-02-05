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
 *              count:
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
  count: number;
  description: string;
  price: number;
};

export const defaultCargo: TCargoDTO = {
  unit: 'all',
  count: 0,
  description: '',
  price: 0,
};