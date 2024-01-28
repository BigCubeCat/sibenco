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
  const subway = wayTwo.split(';');
  const subwaySize = subway.length;
  let nonAbsMaxPercent = 0;

  for (let i = subwaySize - 1; i >= 1; --i) {
    const end = subway.slice(i).join(';');
    const begin = subway.slice(0, i - 1).join(';');
    const beginIndex = wayOne.indexOf(begin);
    if (beginIndex === 0) {
      return {
        ableToMerge: true,
        match: i / largeSize,
      };
    } else if (beginIndex > 0) {
      nonAbsMaxPercent = Math.max(nonAbsMaxPercent, i / subwaySize);
    }

    const endIndex = wayOne.indexOf(end);
    if (endIndex === wayOne.length - end.length) {
      return {
        ableToMerge: true,
        match: i / largeSize,
      };
    } else if (endIndex > 0) {
      nonAbsMaxPercent = Math.max(nonAbsMaxPercent, i / subwaySize);
    }
  }
  return {
    ableToMerge: false,
    match: nonAbsMaxPercent,
  }
}
