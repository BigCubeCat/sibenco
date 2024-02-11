import { intersection } from "lodash";

export type TNaiveCmp = {
  ableToMerge: boolean;
  match: number;
};

function replaceAll(str: string, find: string, replace: string) {
  return str.replace(new RegExp(find, 'g'), replace);
}

export function naiveCompareBoxes(first: string, second: string): TNaiveCmp {
  let wayOne = replaceAll(first, '[b,i,o,n];', ';');
  let wayTwo = replaceAll(second, '[b,i,o,n];', ';');

  if (wayOne.length < wayTwo.length) {
    [wayOne, wayTwo] = [wayTwo, wayOne];
  }

  const largeSize = wayOne.split(';').length;
  if (wayOne.includes(wayTwo)) {
    return {
      ableToMerge: true, match: 1
    };
  }

  const mainWayArray = wayOne.split(';');
  const subway = wayTwo.split(';');
  const subwaySize = subway.length;
  let nonAbsMaxPercent = 0;
  /*
  console.log("main way:");
  console.log(wayOne.split(';'));
  console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - - - -");
  console.log("subway:");
  console.log(subway);
  console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - - - -");
  console.log("intersection:");
  console.log(intersection(subway, wayOne.split(';')));
  console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - - - -");
*/
  for (let i = subwaySize - 1; i >= 1; --i) {
    const end = subway.slice(i).join(';');
    const begin = subway.slice(0, i).join(';');
    const beginIndex = wayOne.indexOf(begin);
    if (beginIndex === 0) {
      return {
        ableToMerge: true,
        match: i / subwaySize,
      };
    } else if (beginIndex > 0) {
      nonAbsMaxPercent = Math.max(nonAbsMaxPercent, i / subwaySize);
    }

    const endIndex = wayOne.indexOf(end);
    if (endIndex === wayOne.length - end.length) {
      return {
        ableToMerge: true,
        match: (subwaySize - i) / subwaySize,
      };
    } else if (endIndex > 0) {
      nonAbsMaxPercent = Math.max(nonAbsMaxPercent, (subwaySize - i) / subwaySize);
    }
  }
  return {
    ableToMerge: false,
    match: intersection(subway, wayOne.split(';')).length / subwaySize,
  }
}
