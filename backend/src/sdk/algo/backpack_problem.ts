import { TOrderDTO } from "../../web/dto/order.dto";
import { TWaypointsDTO } from "../../web/dto/waypoints.dto";



export function getMaxCargo(orders: TOrderDTO[], queue: TWaypointsDTO) {
    const domainFreights: Array<number> = queue.points.map(element => 0);
    const domainPassengers: Array<number> = queue.points.map(element => 0);
    for (let i = 0; i < orders.length; ++i) {
        const currentStartPoint = orders[i].waypoints.points[0];
        const currentEndPoint = orders[i].waypoints.points[orders[i].waypoints.points.length - 1];
        let startFlag = false;
        for (let k = 0; k < queue.points.length; ++k){
            if (!startFlag && queue.points[k].latitude == currentStartPoint.latitude && queue.points[k].longitude == currentStartPoint.longitude) {
                startFlag = true;
            }
            
            if (startFlag) {
                domainPassengers[k] += orders[i].cargo.numberOfPassengersInCar;
                domainFreights[k] += orders[i].cargo.amountOfCargoInCar;
            }

            if (startFlag && queue.points[k].latitude == currentEndPoint.latitude && queue.points[k].longitude == currentEndPoint.longitude) {
                break;
            }
        }
    }
    let maxFreightCount = 0;
    let maxPassengerCount = 0;
    for (let i = 0; i < queue.points.length; ++i){
        if (maxFreightCount < domainFreights[i]) {
            maxFreightCount = domainFreights[i];
        }
        if (maxPassengerCount < domainPassengers[i]) {
            maxPassengerCount = domainPassengers[i];
        }
    }
    return {passengers: maxPassengerCount, freights: maxFreightCount}
}