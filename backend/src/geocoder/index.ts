import { IRouteDoc } from '../models/route.model';
import { makeOptimalRoute, makeOptimalTrip } from '../route_machine_api';
import { getWord } from './goecoder';
import { getOrder } from '../service/order.service';
import { convertAddressDto } from '../utils/coords';
import { IAddressDto, TOrderDoc } from '../models/order.model';
import { ResultWaypoint } from '../route_machine_api/types';

/*
convertIntoBoxes

@param{route} route document

@returns list of coded waypoints
 */

export type AnswerType = {
  waypoints: IAddressDto[];
  words: string[];
};

export const convertIntoBoxes = async (route: IRouteDoc, mode: number): Promise<AnswerType | undefined> => {
  const waypoints: number[][] = [];

  console.log("orders = ", route.route.orders);

  for (let i = 0; i < route.route.orders.length; i++) {
    const orderId = route.route.orders[i];
    const order: TOrderDoc | null = await getOrder(orderId);
    console.log("order = ", order);
    if (!order) continue;
    waypoints.push(await convertAddressDto(order.route.loadingAddress));
    waypoints.push(await convertAddressDto(order.route.unloadingAddress));
  }
  console.log(waypoints);
  console.log("here\n");

  let optimalRoute = await makeOptimalRoute(waypoints);

  if (mode == 1) {          // сделать по-нормальному 
    optimalRoute = await makeOptimalTrip(waypoints);
  }

  console.log(optimalRoute);
  if (optimalRoute === undefined) {
    return;
  }
  const words = new Set<string>([]);
  for (let i = 0; i < optimalRoute.steps.length; i++) {
    const step = optimalRoute.steps[i];
    const word = await getWord('' + step[0], '' + step[1]);
    if (typeof word === "string") {
      words.add(word);
    }
  }

  const addresses: IAddressDto[] = [];

  for (let i = 0; i < waypoints.length; i++) {
    const orderId = route.route.orders[Math.floor(optimalRoute.waypoints[i].inputIndex / 2)];
    const order: TOrderDoc | null = await getOrder(orderId);
    console.log("order = ", order);
    if (!order) continue;
    if (optimalRoute.waypoints[i].inputIndex % 2 == 0) {
      addresses.push(order.route.loadingAddress);
    } else {
      addresses.push(order.route.unloadingAddress);
    }
  }

  const answer: AnswerType = { waypoints: addresses, words: Array.from(words) };

  return answer;
};
