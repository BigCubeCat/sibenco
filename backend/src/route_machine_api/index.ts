import {fetchApiGet} from '../utils/fetch';
import {makeRouteRequestURL, makeTripRequestURL} from './osrm_api';
import {RouteData, RouteResponse, TripResponse} from './types';
import {incorrectRouteMachineWork} from '../config';

export const makeOptimalRoute = async (
  waypoints: Array<Array<number>>,
): Promise<RouteData | undefined> => {
  const url = makeRouteRequestURL(waypoints);
  const optimalRoute: RouteResponse | undefined =
    await fetchApiGet<RouteResponse>(url);
  const resultRoute: RouteData = {waypoints: [], steps: [], distance: 0};
  if (optimalRoute !== undefined) {
    resultRoute.distance = optimalRoute.routes[0].distance;
    const countResultWaypoints = optimalRoute.waypoints.length;

    for (let i = 0; i < countResultWaypoints; i++) {
      resultRoute.waypoints.push({
        index: i,
        location: optimalRoute.waypoints[i].location,
      });
    }

    const countResultLegs = optimalRoute.routes[0].legs.length;

    for (let i = 0; i < countResultLegs; i++) {
      const countResultSteps = optimalRoute.routes[0].legs[i].steps.length;

      for (let j = 0; j < countResultSteps; j++) {
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
  const optimalTrip: TripResponse | undefined = await fetchApiGet<TripResponse>(
    url,
  );
  const resultTrip: RouteData = {waypoints: [], steps: [], distance: 0};
  if (optimalTrip !== undefined) {
    resultTrip.distance = optimalTrip.trips[0]?.distance;
    const countResultWaypoints = optimalTrip.waypoints.length;

    for (let i = 0; i < countResultWaypoints; i++) {
      resultTrip.waypoints.push({
        index: optimalTrip.waypoints[i].waypoint_index,
        location: optimalTrip.waypoints[i].location,
      });
    }

    const countResultLegs = optimalTrip.trips[0].legs.length;

    for (let i = 0; i < countResultLegs; i++) {
      const countResultSteps = optimalTrip.trips[0].legs[i].steps.length;

      for (let j = 0; j < countResultSteps; j++) {
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
