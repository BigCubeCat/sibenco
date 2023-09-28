import * as constants from './consts';

//Функция-составитель ссылок для запросов, service - enum, определяющий тип сервиса,
// coordinates - ключевые точки маршрута, упорядоченные в порядке следования маршрута
export const makeRouteRequestURL = (coordinates: Array<Array<number>>): string => {
  let answer: string =
    constants.serverOSRMAddress + '/' + 
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
