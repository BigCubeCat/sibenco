/**
 * @openapi
 * components:
 *  schemas:
 *      PassengerDTO:
 *          type: object
 *          required:
 *              - name
 *              - contact
 *              - startIndex
 *              - endIndex
 *          properties:
 *              name:
 *                  type: string
 *                  description: "ФИО пассажира"
 *              contact:
 *                  type: string
 *                  description: "Контактный телефон"
 *              startIndex:
 *                  type: number
 *                  description: "индекс остановки в заказе, на которой пассажир входит (остановки индексируются с нуля)"
 *                  format: int64
 *              endIndex:
 *                  type: number
 *                  description: "индекс остановки в заказе, на которой пассажир выходит (остановки индексируются с нуля)"
 *                  format: int64
 */
export type TPassengerDTO = {
  name: string;
  contact: string;
  startIndex: number;
  endIndex: number;
};