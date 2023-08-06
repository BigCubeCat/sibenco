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
Object.defineProperty(exports, "__esModule", { value: true });
const osrm_api_1 = require("./osrm_api");
const MakeNewRoute = (addresses) => __awaiter(void 0, void 0, void 0, function* () {
    /*const waypoints: Array<Array<number>> = []; //Я тестировал с геокодером от geoapify в виде заглушки
    for (const address in addresses) {            //сейчас буду ставить P
        const result = await TransformAddressToLocation(address);
        waypoints.push(result);
    }
    if (waypoints.length == 0) return;*/
    const newRouteData = yield (0, osrm_api_1.MakeOptimalRoute)([[153.0176, -27.5545], [152.9348, -28.0880], [152.9915, -27.9932], [152.6123, -28.3892]], 1 /* Services.TRIP */);
    console.log(newRouteData.waypoints);
});
//пример работы без геокодера, т.к Pelias еще не готов
MakeNewRoute(["254 Антона Петрова улица Барнаул Российская Федерация", "5 Шукшина улица Барнаул Российская Федерация"]);
