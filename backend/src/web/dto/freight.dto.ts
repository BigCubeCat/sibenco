/**
 * @openapi
 * components:
 *  schemas:
 *      FeightDTO:
 *          type: object
 *          required:
 *              - description
 *              - weight
 *              - volume
 *              - startIndex
 *              - endIndex
 *          properties:
 *              descriptioon:
 *                  type: string
 *                  description: "Описание груза"
 *              weight:
 *                  type: number
 *                  description: "Вес груза"
 *                  format: float
 *              volume:
 *                  type: number
 *                  description: "Объем груза"
 *                  format: float
 *              startIndex:
 *                  type: number
 *                  description: "индекс остановки в заказе, на которой загружают груз (остановки индексируются с нуля)"
 *                  format: int64
 *              endIndex:
 *                  type: number
 *                  description: "индекс остановки в заказе, на которой выгружают груз (остановки индексируются с нуля)"
 *                  format: int64
 */
export type TFeightDTO = {
  description: string;
  weight: number;
  volume: number
  startIndex: number;
  endIndex: number;
};