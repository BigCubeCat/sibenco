import { add, forEachRight } from "lodash";
import { convertToOSM, getPointsCoords } from "../../web/dto/address.dto";
import { TWaypointsDTO } from "../../web/dto/waypoints.dto";
import { makeOptimalRoute } from "../route_machine_api"
import { createCoords, optimizeCoord, stringifyCoord } from "./coords";

export const createCoordsFromWaypoints = async (waypoints: TWaypointsDTO): Promise<string> => {
    const waypointsCoordinates = waypoints.points.map(point => convertToOSM(point));
    let route = await makeOptimalRoute(waypointsCoordinates);
    return createCoords(route?.coords || [], waypoints.points.map(point => getPointsCoords(point)));
}

export const getFirstWaypointIndexAfterRoute = (mainRoute: string, waypoints: TWaypointsDTO) => {
    if (waypoints.points.length == 0 || mainRoute.length == 0) {
        return 0;
    }

    const waypointsCoords = waypoints.points.map(point => getPointsCoords(point));

    waypointsCoords.forEach(waypoint => {
        waypoint.lat = optimizeCoord(waypoint.lat);
        waypoint.lon = optimizeCoord(waypoint.lon);
    })
    
    let currentWaypointIndex = 0;
    let currentWaypointString = waypointsCoords[0].lat + "," + waypointsCoords[0].lon;

    let i = 1;
    let start = 0;
    let commaFlag = 1;
    while (i < mainRoute.length) {
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
            let currentCoordSubstring = mainRoute.substring(start, i);
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
        ++i;
    }
    return currentWaypointIndex;
}



export const mergeWaypoints = (mainRoute: string, mainRouteWaypoints: TWaypointsDTO, additionalRouteWaypoints: TWaypointsDTO) => {
    if (mainRoute.length == 0) return additionalRouteWaypoints;
    if (mainRouteWaypoints.points.length == 0) return additionalRouteWaypoints;
    if (additionalRouteWaypoints.points.length == 0) return mainRouteWaypoints;

    if (mainRoute[mainRoute.length - 1] != ";") mainRoute = mainRoute + ";";

    const mainRouteWaypointsCoords = mainRouteWaypoints.points.map(point => getPointsCoords(point));
    const additionalRouteWaypointsCoords = additionalRouteWaypoints.points.map(point => getPointsCoords(point));
    
    const resultWaypoints: TWaypointsDTO = { points: [] };
    

    mainRouteWaypointsCoords.forEach(waypoint => {
        waypoint.lat = optimizeCoord(waypoint.lat);
        waypoint.lon = optimizeCoord(waypoint.lon);
    })

    additionalRouteWaypointsCoords.forEach(waypoint => {
        waypoint.lat = optimizeCoord(waypoint.lat);
        waypoint.lon = optimizeCoord(waypoint.lon);
    })

    let currentAdditionalRouteWaypointIndex = 0;
    let currentAdditionalWaypointString = additionalRouteWaypointsCoords[0].lat + "," + additionalRouteWaypointsCoords[0].lon;
    let currentMainRouteWaypointIndex = 0;
    let currentMainWaypointString = mainRouteWaypointsCoords[0].lat + "," + mainRouteWaypointsCoords[0].lon;

    let i = 1;
    let start = 0;
    let commaFlag = 1;
    while (i < mainRoute.length) {
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
            let currentCoordSubstring = mainRoute.substring(start, i);
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
        ++i;
    }
    for (let iter = currentAdditionalRouteWaypointIndex; iter < additionalRouteWaypoints.points.length; ++iter){
        resultWaypoints.points.push(additionalRouteWaypoints.points[iter]);
    }
    for (let iter = currentMainRouteWaypointIndex; iter < mainRouteWaypoints.points.length; ++iter){
        resultWaypoints.points.push(mainRouteWaypoints.points[iter]);
    }
    
    return resultWaypoints;
}