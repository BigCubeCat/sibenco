/**
 * @openapi
 * components:
 *  schemas:
 *      Deadline:
 *          type: object
 *          required:
 *              - noDeadline
 *              - beginDate
 *              - endDate
 *          properties:
 *              noDeadline:
 *                  type: boolean
 *                  description: "true, если заявка с открытой датой"
 *                  default: false
 *              beginDate:
 *                  type: number
 *                  description: "Дата начала в unixtime"
 *              endDate:
 *                  type: number
 *                  description: "Крайний срок в unixtime"
 */
export type TDeadline = {
  noDeadline: boolean;
  beginDate?: number;
  endDate?: number;
};

export const sameDeadline = (x: TDeadline, y: TDeadline) => {
  if (x.noDeadline && y.noDeadline) {
    return true;
  }
  if (!(x.beginDate && y.beginDate && x.endDate && y.endDate) ) return false;
  if (x.beginDate > y?.endDate) return false;
  return x.endDate >= y.beginDate;
};