import { convertToOSM, getPointsCoords } from "../../web/dto/address.dto";
import { TWaypointsDTO } from "../../web/dto/waypoints.dto";
import { makeOptimalRoute } from "../route_machine_api"
import { createCoords, optimizeCoord } from "./coords";


const makeOptimizedCoords = (waypoints: TWaypointsDTO) => {
    const waypointsCoords = waypoints.points.map(point => getPointsCoords(point));
    waypointsCoords.forEach(waypoint => {
        waypoint.lat = optimizeCoord(waypoint.lat);
        waypoint.lon = optimizeCoord(waypoint.lon);
    })
    return waypointsCoords;
}

export const createCoordsFromWaypoints = async (waypoints: TWaypointsDTO): Promise<string> => {
    const waypointsCoordinates = waypoints.points.map(point => convertToOSM(point));
    const route = await makeOptimalRoute(waypointsCoordinates);
    return createCoords(route?.coords || [], waypoints.points.map(point => getPointsCoords(point)));
}

export const getFirstWaypointIndexAfterRoute = (mainRoute: string, waypoints: TWaypointsDTO) => {
    if (waypoints.points.length == 0 || mainRoute.length == 0) {
        return 0;
    }

    const waypointsCoords = makeOptimizedCoords(waypoints);

    let currentWaypointIndex = 0;
    let currentWaypointString = waypointsCoords[0].lat + "," + waypointsCoords[0].lon;

    let start = 0;
    let commaFlag = 1;
    for (let i = 0; i < mainRoute.length; ++i) {
        if (mainRoute[i] == ';') {
            start = i + 1;
        }
        else if (mainRoute[i] == ',') {
            if (commaFlag == 1) {
                commaFlag += 2;
            } else {
                commaFlag = 0;
            }
        }
        if (commaFlag == 0) {
            commaFlag++;
            const currentCoordSubstring = mainRoute.substring(start, i);
            if (currentCoordSubstring == currentWaypointString) {
                if (currentWaypointIndex < waypointsCoords.length - 1) {
                    currentWaypointIndex++;
                    currentWaypointString = waypointsCoords[currentWaypointIndex].lat + "," + waypointsCoords[currentWaypointIndex].lon;
                } else {
                    currentWaypointIndex++;
                    break;
                }
            }
        }
    }
    return currentWaypointIndex;
}



export const mergeWaypoints = (mainRoute: string, mainRouteWaypoints: TWaypointsDTO, additionalRouteWaypoints: TWaypointsDTO) => {
    if (mainRoute.length == 0) return additionalRouteWaypoints;
    if (mainRouteWaypoints.points.length == 0) return additionalRouteWaypoints;
    if (additionalRouteWaypoints.points.length == 0) return mainRouteWaypoints;

    if (mainRoute[mainRoute.length - 1] != ";") mainRoute = mainRoute + ";";

    const mainRouteWaypointsCoords = makeOptimizedCoords(mainRouteWaypoints);
    const additionalRouteWaypointsCoords = makeOptimizedCoords(additionalRouteWaypoints);
    
    const resultWaypoints: TWaypointsDTO = { points: [] };

    let currentAdditionalRouteWaypointIndex = 0;
    let currentAdditionalWaypointString = additionalRouteWaypointsCoords[0].lat + "," + additionalRouteWaypointsCoords[0].lon;
    let currentMainRouteWaypointIndex = 0;
    let currentMainWaypointString = mainRouteWaypointsCoords[0].lat + "," + mainRouteWaypointsCoords[0].lon;

    let start = 0;
    let commaFlag = 1;
    for (let i = 0; i < mainRoute.length; ++i) {
        if (mainRoute[i] == ';') {
            start = i + 1;
        }
        else if (mainRoute[i] == ',') {
            if (commaFlag == 1) {
                commaFlag += 2;
            } else {
                commaFlag = 0;
            }
        }
        if (commaFlag == 0) {
            commaFlag++;
            const currentCoordSubstring = mainRoute.substring(start, i);
            if (currentCoordSubstring == currentAdditionalWaypointString) {

                resultWaypoints.points.push(additionalRouteWaypoints.points[currentAdditionalRouteWaypointIndex]);

                if (currentAdditionalWaypointString == currentMainWaypointString) {

                    if (mainRouteWaypoints.points[currentMainRouteWaypointIndex].address ==
                        additionalRouteWaypoints.points[currentAdditionalRouteWaypointIndex].address) {
                        
                        if ((mainRouteWaypoints.points[currentMainRouteWaypointIndex].pointType == "i" &&
                            additionalRouteWaypoints.points[currentAdditionalRouteWaypointIndex].pointType == "o") ||
                            (mainRouteWaypoints.points[currentMainRouteWaypointIndex].pointType == "o" &&
                                additionalRouteWaypoints.points[currentAdditionalRouteWaypointIndex].pointType == "i") ||
                            mainRouteWaypoints.points[currentMainRouteWaypointIndex].pointType == "b" ||
                            additionalRouteWaypoints.points[currentAdditionalRouteWaypointIndex].pointType == "b") {
                            resultWaypoints.points[resultWaypoints.points.length - 1].pointType = "b";        
                        }
                    } else {
                        resultWaypoints.points.push(mainRouteWaypoints.points[currentMainRouteWaypointIndex]);
                        
                        if (currentMainRouteWaypointIndex < mainRouteWaypointsCoords.length - 1) {
                            currentMainRouteWaypointIndex++;
                            currentMainWaypointString = mainRouteWaypointsCoords[currentMainRouteWaypointIndex].lat + "," + mainRouteWaypointsCoords[currentMainRouteWaypointIndex].lon;
                        } else {
                            currentMainRouteWaypointIndex++;
                            break;
                        }
                    }
                }

                if (currentAdditionalRouteWaypointIndex < additionalRouteWaypointsCoords.length - 1) {
                            currentAdditionalRouteWaypointIndex++;
                            currentAdditionalWaypointString = additionalRouteWaypointsCoords[currentAdditionalRouteWaypointIndex].lat + "," + additionalRouteWaypointsCoords[currentAdditionalRouteWaypointIndex].lon;
                } else {
                    currentAdditionalRouteWaypointIndex++;
                    break;
                }

            } else if (currentCoordSubstring == currentMainWaypointString) {
                resultWaypoints.points.push(mainRouteWaypoints.points[currentMainRouteWaypointIndex]);
                if (currentMainRouteWaypointIndex < mainRouteWaypointsCoords.length - 1) {
                    currentMainRouteWaypointIndex++;
                    currentMainWaypointString = mainRouteWaypointsCoords[currentMainRouteWaypointIndex].lat + "," + mainRouteWaypointsCoords[currentMainRouteWaypointIndex].lon;
                } else {
                    currentMainRouteWaypointIndex++;
                    break;
                }
            }
        }
    }
    for (let iter = currentAdditionalRouteWaypointIndex; iter < additionalRouteWaypoints.points.length; ++iter){
        resultWaypoints.points.push(additionalRouteWaypoints.points[iter]);
    }
    for (let iter = currentMainRouteWaypointIndex; iter < mainRouteWaypoints.points.length; ++iter){
        resultWaypoints.points.push(mainRouteWaypoints.points[iter]);
    }
    
    return resultWaypoints;
}