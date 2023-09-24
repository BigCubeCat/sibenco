import * as constants from './consts';

//Функция-составитель ссылок для запросов, service - enum, определяющий тип сервиса,
// coordinates - ключевые точки маршрута, упорядоченные в порядке следования маршрута
const makeRouteRequestURL = (coordinates: Array<Array<number>>): string => {
  let answer: string =
    constants.serverOSRMAddress +
    constants.osrmServiceRoute +
    constants.osrmServiceVersion +
    constants.osrmProfileCar;
  answer += coordinates
    .map((coordinate: number[]) => `${coordinate[0]},${coordinate[1]}`)
    .join(';');
  answer += `?` + constants.osrmRouteOptions;
  console.log("route URL", answer);
  return answer;
};

const makeTripRequestURL = (coordinates: Array<Array<number>>): string => {
  const countCoordinates = coordinates.length;
  let answer: string =
    constants.serverOSRMAddress +
    constants.osrmServiceTrip +
    constants.osrmServiceVersion +
    constants.osrmProfileCar;
  for (let i = 0; i < countCoordinates; i++) {
    answer += `${coordinates[i][0]},${coordinates[i][1]}`;
    if (i < countCoordinates - 1) {
      answer += ';';
    }
  }
  answer += `?` + constants.osrmTripOptions;
  return answer;
};

export {makeTripRequestURL, makeRouteRequestURL};
