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

export const getDeadlineIntersection = (x: TDeadline, y: TDeadline): TDeadline => {
  if (x.noDeadline && y.noDeadline) {
    return { noDeadline: true };
  }
  if (x.noDeadline) {
    return y;
  }
  if (y.noDeadline) {
    return x;
  }
  const resultDeadline = {
    noDeadline: false,
    beginDate: Math.max(x.beginDate || 0, y.beginDate || 0),
    endDate: Math.min(x.endDate || Infinity, y.endDate || Infinity)
  };
  return resultDeadline;
}