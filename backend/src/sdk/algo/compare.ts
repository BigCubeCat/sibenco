const optimizeCoord = (n: number, degree = 100) => Math.round(n * degree) / degree;
export const optimizeCoordinates = (coords: number[][]): number[][] => {
  const resultCoordinates = [[0, 0]];
  coords.forEach(coord => {

    const newCoord = [
      optimizeCoord(coord[1]),
      optimizeCoord(coord[0]),
    ];
    if (
      resultCoordinates[resultCoordinates.length - 1][0] !== newCoord[0]
      && resultCoordinates[resultCoordinates.length - 1][1] !== newCoord[1]) {
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
export const vectorizeCoordinates = (coords: number[][]): number[][] => {
  for (let i = 0; i < coords.length - 1; ++i) {
    coords[i].push(getDirection(coords[i][0], coords[i + 1][0]));
    coords[i].push(getDirection(coords[i][1], coords[i + 1][1]));
  }
  return coords;
};

export const createCoords = (coords: number[][]): number[][] => vectorizeCoordinates(optimizeCoordinates(coords));