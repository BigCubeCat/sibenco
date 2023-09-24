import {IRouteDoc} from '../models/route.model';
import {makeOptimalRoute} from '../route_machine_api';
import {getWord} from './goecoder';
import {getOrder} from '../service/order.service';
import {convertAddressDto} from '../utils/coords';
import {TOrderDoc} from '../models/order.model';
import {type} from "os";

export const convertIntoBoxes = async (route: IRouteDoc) => {
  const waypoints: number[][] = [];
  for (let i = 0; i < route.route.orders.length; i++) {
    const orderId = route.route.orders[i];
    const order: TOrderDoc | null = await getOrder(orderId);
    if (!order) continue;
    console.log("loading = ", order.route.loadingAddress);
    console.log("unloading = ", order.route.unloadingAddress);
    waypoints.push(await convertAddressDto(order.route.loadingAddress));
    waypoints.push(await convertAddressDto(order.route.unloadingAddress));
  }
  console.log("waypoints = ", waypoints);
  const optimalRoute = await makeOptimalRoute(waypoints);
  console.log("optimalRoute = ", optimalRoute);
  if (optimalRoute === undefined) {
    return [];
  }
  // TODO тут нет ошибки?)
  console.log("waypoints = ", optimalRoute.waypoints);
  const words = new Set<string>([]);
  for (let i = 0; i < optimalRoute.steps.length; i++) {
    const step = optimalRoute.steps[i];
    console.log(step);
    const word = await getWord('' + step[0], '' + step[1]);
    console.log(word);
    if (typeof word === "string") {
      words.add(word);
    }
  }

  return Array.from(words);
};