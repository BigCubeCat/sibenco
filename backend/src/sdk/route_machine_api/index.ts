import {fetchApiGet} from '../utils/fetch';
import {makeRouteRequestURL} from './osrm_api';
import {RouteData, RouteResponse} from './types';

export const makeOptimalRoute = async (
  waypoints: Array<Array<number>>,
): Promise<RouteData | undefined> => {
  const url = makeRouteRequestURL(waypoints);
  const optimalRoute = await fetchApiGet<RouteResponse>(url);

  if (!optimalRoute) {
    console.log('The error occurred while routing machine was working');
    return undefined;
  }

  const bestRoute = optimalRoute.routes[0];
  const resultRoute: RouteData = {
    nodes: [],
    coords: bestRoute.geometry.coordinates,
    distance: bestRoute.distance,
    duration: bestRoute.duration,
  };
  bestRoute.legs.forEach(leg => {
    resultRoute.nodes.push(...leg.annotation.nodes);
  });

  return resultRoute;
};

//примеры работ основных функций osrm_api
//console.log( makeRequestURL(Services.TRIP, [[ 153.0176,-27.5545],[ 152.6123,-28.3892],[ 152.9915,-27.9932]]));
//getResponse<TripResponse>("http://localhost:5000/trip/v1/driving/153.0176,-27.5545;152.6123,-28.3892;152.9915,-27.9932?roundtrip=false&source=first&destination=last&steps=true");
//makeOptimalRoute([[153.0176, -27.5545], [152.6123, -28.3892], [152.9915, -27.9932]], Services.TRIP);
