import { max, min } from "lodash";

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

export const getDedlineIntersection = (x: TDeadline, y: TDeadline): TDeadline => {
  if (x.noDeadline && y.noDeadline) {
    return { noDeadline: true };
  }
  if (x.noDeadline) {
    return y;
  }
  if (y.noDeadline) {
    return x;
  }

  let maxBegin: number | undefined = 0;

  if (x.beginDate) {
    if (y.beginDate) {
      maxBegin = max([x.beginDate, y.beginDate]);
    } else {
      maxBegin = x.beginDate;
    }
  } else {
    if (y.beginDate) {
      maxBegin = y.beginDate;
    } else {
      maxBegin = undefined;
    }
  }

  let minEnd: number | undefined = 0;

  if (x.endDate) {
    if (y.endDate) {
      minEnd = min([x.endDate, y.endDate]);
    } else {
      minEnd = x.endDate;
    }
  } else {
    if (y.endDate) {
      minEnd = y.endDate;
    } else {
      minEnd = undefined;
    }
  }

  return {
    noDeadline: false,
    beginDate: maxBegin,
    endDate: minEnd
  }
}