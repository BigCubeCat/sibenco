import {incorrectGeocoderWork, incorrectRouteMachineWork, Services} from "./consts";

import {TransformAddressToLocation} from "./geocoder_api";
import {MakeOptimalRoute} from "./osrm_api";


const MakeNewRoute = async (addresses: Array<string>) => {
    /*const waypoints: Array<Array<number>> = []; //Я тестировал с геокодером от geoapify в виде заглушки
    for (const address in addresses) {            //сейчас буду ставить P
        const result = await TransformAddressToLocation(address);
        waypoints.push(result);
    }
    if (waypoints.length == 0) return;*/
    const newRouteData = await MakeOptimalRoute([[ 153.0176,-27.5545],[ 152.9348,-28.0880],[ 152.9915,-27.9932],[ 152.6123,-28.3892]], Services.TRIP);
    console.log(newRouteData.waypoints);
}


//пример работы без геокодера, т.к Pelias еще не готов
MakeNewRoute(["254 Антона Петрова улица Барнаул Российская Федерация","5 Шукшина улица Барнаул Российская Федерация"]);