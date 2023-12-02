const optimizeCoord = (n: number, degree = 100) => Math.floor(n * degree) / degree;
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
  resultCoordinates.shift()
  return resultCoordinates;
};