import fetch from 'node-fetch';

//Сервисы OSRM
//Стандартные оповещения об ошибках
//Константы используемые в http-запросах
import * as constants from './consts';

// Типы для описания ответа osrm
import {RouteData, RouteResponse, TripResponse} from './types';
import {incorrectRouteMachineWork} from '../config';

//Функция-составитель ссылок для запросов, service - enum, определяющий тип сервиса,
// coordinates - ключевые точки маршрута, упорядоченные в порядке следования маршрута
const makeRouteRequestURL = (coordinates: Array<Array<number>>): string => {
  const countCoordinates = coordinates.length;
  let answer: string =
    constants.serverOSRMAddress +
    constants.osrmServiceRoute +
    constants.osrmServiceVersion +
    constants.osrmProfileCar;
  for (let i = 0; i < countCoordinates; i++) {
    answer += `${coordinates[i][0]},${coordinates[i][1]}`;
    if (i < countCoordinates - 1) {
      answer += ';';
    }
  }
  answer += `?` + constants.osrmRouteOptions;
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
    if (i < countCoordinates - 1) answer += ';';
  }
  answer += `?` + constants.osrmTripOptions;
  return answer;
};

//функция поиска маршрута, T определяет тип сервиса:route или trip, address - адресная строка запроса
const getResponse = async <T>(address: string): Promise<T | undefined> => {
  try {
    const response = await fetch(address);

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    return await response.json() as T;
  } catch (error) {
    if (error instanceof Error) {
      console.log('error message: ', error.message);
    } else {
      console.log('unexpected error: ', error);
    }
  }
};

//общая функция, которая возвращает данные об оптимальном маршруте в виде типа AnswerRoute, на вход подаются
//ключевые точки маршрута, waypoints[0] - первый пункт, waypoints[waypoints.length()-1] - конечная точка маршрута
//service - enum, определяющий тип сервиса

export const makeOptimalRoute = async (
  waypoints: Array<Array<number>>,
): Promise<RouteData | undefined> => {
  const url = makeRouteRequestURL(waypoints);
  const optimalRoute: RouteResponse | undefined =
    await getResponse<RouteResponse>(url);
  const resultRoute: RouteData = {waypoints: [], steps: [], distance: 0};
  if (optimalRoute !== undefined) {
    resultRoute.distance = optimalRoute.routes[0].distance;
    const cntResultWaypoints = optimalRoute.waypoints.length;

    for (let i = 0; i < cntResultWaypoints; i++) {
      resultRoute.waypoints.push({
        index: i,
        location: optimalRoute.waypoints[i].location,
      });
    }

    const cntResultLegs = optimalRoute.routes[0].legs.length;

    for (let i = 0; i < cntResultLegs; i++) {
      const cntResultSteps = optimalRoute.routes[0].legs[i].steps.length;

      for (let j = 0; j < cntResultSteps; j++) {
        resultRoute.steps.push(
          optimalRoute.routes[0].legs[i].steps[j].maneuver.location,
        );
      }
    }
    resultRoute.waypoints = resultRoute.waypoints.sort(
      (objA, objB) => objA.index - objB.index,
    );
    return resultRoute;
  } else {
    console.log(incorrectRouteMachineWork);
  }
};


export const makeOptimalTrip = async (
  waypoints: Array<Array<number>>,
): Promise<RouteData | undefined> => {
  const url = makeTripRequestURL(waypoints);
  const optimalTrip: TripResponse | undefined = await getResponse<TripResponse>(url);
  const resultTrip: RouteData = {waypoints: [], steps: [], distance: 0};
  if (optimalTrip !== undefined) {
    resultTrip.distance = optimalTrip.trips[0]?.distance;
    const cntResultWaypoints = optimalTrip.waypoints.length;

    for (let i = 0; i < cntResultWaypoints; i++) {
      resultTrip.waypoints.push({
        index: optimalTrip.waypoints[i].waypoint_index,
        location: optimalTrip.waypoints[i].location,
      });
    }

    const cntResultLegs = optimalTrip.trips[0].legs.length;

    for (let i = 0; i < cntResultLegs; i++) {
      const cntResultSteps = optimalTrip.trips[0].legs[i].steps.length;

      for (let j = 0; j < cntResultSteps; j++) {
        resultTrip.steps.push(
          optimalTrip.trips[0].legs[i].steps[j].maneuver.location,
        );
      }
    }
    resultTrip.waypoints = resultTrip?.waypoints.sort(
      (objA, objB) => objA.index - objB.index,
    );
    return resultTrip;
  } else {
    console.log(incorrectRouteMachineWork);
  }
};

//примеры работ основных функций osrm_api
//console.log( makeRequestURL(Services.TRIP, [[ 153.0176,-27.5545],[ 152.6123,-28.3892],[ 152.9915,-27.9932]]));
//getResponse<TripResponse>("http://localhost:5000/trip/v1/driving/153.0176,-27.5545;152.6123,-28.3892;152.9915,-27.9932?roundtrip=false&source=first&destination=last&steps=true");
//makeOptimalRoute([[153.0176, -27.5545], [152.6123, -28.3892], [152.9915, -27.9932]], Services.TRIP);
