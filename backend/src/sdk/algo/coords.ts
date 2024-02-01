import {config} from "../../config";

interface ISimplifiedPoint {
  lat: number;
  lon: number;
  type: string;
}


export const optimizeCoord = (n: number, degree = config.osrm.accuracy) => Math.round(n * degree) / degree;

const optimizeCoordinates = (coords: number[][]): number[][] => {
  const resultCoordinates = [[0, 0]];
  coords.forEach(coord => {

    const newCoord = [
      optimizeCoord(coord[1]),
      optimizeCoord(coord[0]),
    ];
    if (
      resultCoordinates[resultCoordinates.length - 1][0] !== newCoord[0]
      && resultCoordinates[resultCoordinates.length - 1][1] !== newCoord[1]
    ) {
      resultCoordinates.push(newCoord);
    }
  });
  resultCoordinates.shift();
  return resultCoordinates;
};

const getDirection = (_from: number, _to: number) => {
  const r = Math.round(_to * 100) - Math.round(_from * 100);
  if (r === 0) return 0;
  return (r < 0) ? -1 : 1;
};

/*
Реализует добавление направления движения в каждом квадрате.
 */
const vectorizeCoordinates = (coords: number[][]): number[][] => {
  for (let i = 0; i < coords.length - 1; ++i) {
    coords[i].push(getDirection(coords[i][0], coords[i + 1][0]));
    coords[i].push(getDirection(coords[i][1], coords[i + 1][1]));
  }
  return coords;
};

const stringifyVelocity = (lat: number, lon: number) => {
  const getSymbol = (value: number) => {
    if (value === 0) return 'o';
    if (value < 0) return 'n';
    return 'p';
  }
  return getSymbol(lat) + getSymbol(lon);
}

export const stringifyCoord = (coord: number[], stopCoords: ISimplifiedPoint[]): string => {
  let pointType = 'n';
  stopCoords.forEach(stopCoord => {
    if (equalPoint(coord, [stopCoord.lat, stopCoord.lon])) {
      pointType = stopCoord.type;
    }
  })
  return coord[0] + "," + coord[1] + "," + stringifyVelocity(coord[2], coord[3]) + pointType;
}

const equalPoint = (first: number[], second: number[]) => (first[0] === second[0]) && (first[1] === second[1]);


const stringifyCoordinates = (coords: number[][], stopCoords: ISimplifiedPoint[]): string => {
  return coords.map(coord => stringifyCoord(coord, stopCoords)).join(';');
}

export const createCoords = (coords: number[][], points: ISimplifiedPoint[]): string => { //здесь coords - это координаты каждой точки 
  const stopCoords = points.map(point => {                                                //в геометрии маршрута, а points - точки остановок
    return {
      lat: optimizeCoord(point.lat),
      lon: optimizeCoord(point.lon),
      type: point.type
    };
  });
  return stringifyCoordinates(
    vectorizeCoordinates(
      optimizeCoordinates(coords)
    ),
    stopCoords
  );
}

export const getRedisKey = (point: ISimplifiedPoint) => {
  let result = "";
  result += optimizeCoord(point.lat, 1) + '_';
  result += optimizeCoord(point.lon, 1);
  return result;
}

