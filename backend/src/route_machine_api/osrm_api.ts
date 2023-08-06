import fetch from 'node-fetch';

//Сервисы OSRM
//Стандартные оповещения об ошибках
//Константы используемые в http-запросах
import {
    incorrectRouteMachineWork,
    incorrectServiceParameter,
    osrmProfileCar,
    osrmRouteOptions,
    osrmServiceRoute,
    osrmServiceTrip,
    osrmServiceVersion,
    osrmTripOptions,
    serverOSRMAddress,
    Services
} from "./consts";

// Типы для описания ответа osrm
import {RouteData, RouteResponse, TripResponse} from "./types";

//Функция-составитель ссылок для запросов, service - enum, определяющий тип сервиса,
// coordinates - ключевые точки маршрута, упорядоченные в порядке следования маршрута
const MakeRequestURL = (service: Services, coordinates: Array<Array<number>>): string => {

    const cntCoordinates = coordinates.length
    if (service === Services.ROUTE) {
        let answer: string = serverOSRMAddress + osrmServiceRoute + osrmServiceVersion + osrmProfileCar;

        for (let i = 0; i < cntCoordinates; i++) {
            answer += `${coordinates[i][0]},${coordinates[i][1]}`;
            if (i < cntCoordinates - 1) {
                answer += ';';
            }
        }

        answer += `?` + osrmRouteOptions;
        return answer;
    } else if (service === Services.TRIP) {
        let answer: string = serverOSRMAddress + osrmServiceTrip + osrmServiceVersion + osrmProfileCar;

        for (let i = 0; i < cntCoordinates; i++) {
            answer += `${coordinates[i][0]},${coordinates[i][1]}`;

            if (i < cntCoordinates - 1) answer += ';';
        }
        answer += `?` + osrmTripOptions;
        return answer;
    } else {
        return incorrectServiceParameter;
    }
}


//функция поиска маршрута, T определяет тип сервиса:route или trip, address - адресная строка запроса
// @ts-ignore
const GetResponse = async <T>(address: string): Promise<T> => {
    try {
        const response = await fetch(address);

        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
        }

        const result = (await response.json()) as T;
        return result;

    } catch (error) {
        if (error instanceof Error) {
            console.log('error message: ', error.message);
        } else {
            console.log('unexpected error: ', error);
        }
    }
}

//общая функция, которая возвращает данные об оптимальном маршруте в виде типа AnswerRoute, на вход подаются
//ключевые точки маршрута, waypoints[0] - первый пункт, waypoints[waypoints.length()-1] - конечная точка маршрута
//service - enum, определяющий тип сервиса
// @ts-ignore
export const MakeOptimalRoute = async (waypoints: Array<Array<number>>, service: Services): Promise<RouteData> => {
    if (service === Services.ROUTE) {
        const url = MakeRequestURL(service, waypoints);
        const optimalRoute: RouteResponse | null = await GetResponse<RouteResponse>(url);

        if (typeof optimalRoute != null) {
            const resultRoute: RouteData = {waypoints: [], steps: [], distance: 0};
            resultRoute.distance = optimalRoute.routes[0].distance
            const cntResultWaypoints = optimalRoute.waypoints.length;

            for (let i = 0; i < cntResultWaypoints; i++) {
                resultRoute.waypoints.push({index: i, location: optimalRoute.waypoints[i].location});
            }

            const cntResultLegs = optimalRoute.routes[0].legs.length

            for (let i = 0; i < cntResultLegs; i++) {

                const cntResultSteps = optimalRoute.routes[0].legs[i].steps.length

                for (let j = 0; j < cntResultSteps; j++) {
                    resultRoute.steps.push(optimalRoute.routes[0].legs[i].steps[j].maneuver.location);
                }
            }
            resultRoute.waypoints = resultRoute.waypoints.sort((objA, objB) => objA.index - objB.index);
            return resultRoute;

        } else {
            console.log(incorrectRouteMachineWork);
        }
    } else if (service === Services.TRIP) {
        const url = MakeRequestURL(service, waypoints);
        console.log(url);
        const optimalRoute: TripResponse = await GetResponse<TripResponse>(url);


        const resultRoute: RouteData = {waypoints: [], steps: [], distance: 0};
        resultRoute.distance = optimalRoute.trips[0]?.distance
        const cntResultWaypoints = optimalRoute.waypoints.length;

        for (let i = 0; i < cntResultWaypoints; i++) {
            // @ts-ignore
            resultRoute.waypoints.push({index: optimalRoute.waypoints[i].waypoint_index, location: optimalRoute.waypoints[i].location});
        }

        const cntResultLegs = optimalRoute.trips[0].legs.length

        for (let i = 0; i < cntResultLegs; i++) {

            const cntResultSteps = optimalRoute.trips[0].legs[i].steps.length

            for (let j = 0; j < cntResultSteps; j++) {
                resultRoute.steps.push(optimalRoute.trips[0].legs[i].steps[j].maneuver.location);
            }
        }
        resultRoute.waypoints = resultRoute?.waypoints.sort((objA, objB) => objA.index - objB.index);
        return resultRoute;


    } else {
        console.log(incorrectServiceParameter);
    }
}

//примеры работ основных функций osrm_api
//console.log( MakeRequestURL(Services.TRIP, [[ 153.0176,-27.5545],[ 152.6123,-28.3892],[ 152.9915,-27.9932]]));
//GetResponse<TripResponse>("http://localhost:5000/trip/v1/driving/153.0176,-27.5545;152.6123,-28.3892;152.9915,-27.9932?roundtrip=false&source=first&destination=last&steps=true");
//MakeOptimalRoute([[153.0176, -27.5545], [152.6123, -28.3892], [152.9915, -27.9932]], Services.TRIP);