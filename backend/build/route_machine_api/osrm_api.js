"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeOptimalRoute = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
//Сервисы OSRM
//Стандартные оповещения об ошибках
//Константы используемые в http-запросах
const consts_1 = require("./consts");
//Функция-составитель ссылок для запросов, service - enum, определяющий тип сервиса,
// coordinates - ключевые точки маршрута, упорядоченные в порядке следования маршрута
const MakeRequestURL = (service, coordinates) => {
    const cntCoordinates = coordinates.length;
    if (service === 0 /* Services.ROUTE */) {
        let answer = consts_1.serverOSRMAddress + consts_1.osrmServiceRoute + consts_1.osrmServiceVersion + consts_1.osrmProfileCar;
        for (let i = 0; i < cntCoordinates; i++) {
            answer += `${coordinates[i][0]},${coordinates[i][1]}`;
            if (i < cntCoordinates - 1) {
                answer += ';';
            }
        }
        answer += `?` + consts_1.osrmRouteOptions;
        return answer;
    }
    else if (service === 1 /* Services.TRIP */) {
        let answer = consts_1.serverOSRMAddress + consts_1.osrmServiceTrip + consts_1.osrmServiceVersion + consts_1.osrmProfileCar;
        for (let i = 0; i < cntCoordinates; i++) {
            answer += `${coordinates[i][0]},${coordinates[i][1]}`;
            if (i < cntCoordinates - 1)
                answer += ';';
        }
        answer += `?` + consts_1.osrmTripOptions;
        return answer;
    }
    else {
        return consts_1.incorrectServiceParameter;
    }
};
//функция поиска маршрута, T определяет тип сервиса:route или trip, address - адресная строка запроса
// @ts-ignore
const GetResponse = (address) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield (0, node_fetch_1.default)(address);
        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
        }
        const result = (yield response.json());
        return result;
    }
    catch (error) {
        if (error instanceof Error) {
            console.log('error message: ', error.message);
        }
        else {
            console.log('unexpected error: ', error);
        }
    }
});
//общая функция, которая возвращает данные об оптимальном маршруте в виде типа AnswerRoute, на вход подаются
//ключевые точки маршрута, waypoints[0] - первый пункт, waypoints[waypoints.length()-1] - конечная точка маршрута
//service - enum, определяющий тип сервиса
// @ts-ignore
const MakeOptimalRoute = (waypoints, service) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (service === 0 /* Services.ROUTE */) {
        const url = MakeRequestURL(service, waypoints);
        const optimalRoute = yield GetResponse(url);
        if (typeof optimalRoute != null) {
            const resultRoute = { waypoints: [], steps: [], distance: 0 };
            resultRoute.distance = optimalRoute.routes[0].distance;
            const cntResultWaypoints = optimalRoute.waypoints.length;
            for (let i = 0; i < cntResultWaypoints; i++) {
                resultRoute.waypoints.push({ index: i, location: optimalRoute.waypoints[i].location });
            }
            const cntResultLegs = optimalRoute.routes[0].legs.length;
            for (let i = 0; i < cntResultLegs; i++) {
                const cntResultSteps = optimalRoute.routes[0].legs[i].steps.length;
                for (let j = 0; j < cntResultSteps; j++) {
                    resultRoute.steps.push(optimalRoute.routes[0].legs[i].steps[j].maneuver.location);
                }
            }
            resultRoute.waypoints = resultRoute.waypoints.sort((objA, objB) => objA.index - objB.index);
            return resultRoute;
        }
        else {
            console.log(consts_1.incorrectRouteMachineWork);
        }
    }
    else if (service === 1 /* Services.TRIP */) {
        const url = MakeRequestURL(service, waypoints);
        console.log(url);
        const optimalRoute = yield GetResponse(url);
        const resultRoute = { waypoints: [], steps: [], distance: 0 };
        resultRoute.distance = (_a = optimalRoute.trips[0]) === null || _a === void 0 ? void 0 : _a.distance;
        const cntResultWaypoints = optimalRoute.waypoints.length;
        for (let i = 0; i < cntResultWaypoints; i++) {
            // @ts-ignore
            resultRoute.waypoints.push({ index: optimalRoute.waypoints[i].waypoint_index, location: optimalRoute.waypoints[i].location });
        }
        const cntResultLegs = optimalRoute.trips[0].legs.length;
        for (let i = 0; i < cntResultLegs; i++) {
            const cntResultSteps = optimalRoute.trips[0].legs[i].steps.length;
            for (let j = 0; j < cntResultSteps; j++) {
                resultRoute.steps.push(optimalRoute.trips[0].legs[i].steps[j].maneuver.location);
            }
        }
        resultRoute.waypoints = resultRoute === null || resultRoute === void 0 ? void 0 : resultRoute.waypoints.sort((objA, objB) => objA.index - objB.index);
        return resultRoute;
    }
    else {
        console.log(consts_1.incorrectServiceParameter);
    }
});
exports.MakeOptimalRoute = MakeOptimalRoute;
//примеры работ основных функций osrm_api
//console.log( MakeRequestURL(Services.TRIP, [[ 153.0176,-27.5545],[ 152.6123,-28.3892],[ 152.9915,-27.9932]]));
//GetResponse<TripResponse>("http://localhost:5000/trip/v1/driving/153.0176,-27.5545;152.6123,-28.3892;152.9915,-27.9932?roundtrip=false&source=first&destination=last&steps=true");
//MakeOptimalRoute([[153.0176, -27.5545], [152.6123, -28.3892], [152.9915, -27.9932]], Services.TRIP);