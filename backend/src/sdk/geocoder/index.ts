import { IRouteDoc } from '../../web/models/route.model';
import { makeOptimalRoute } from '../route_machine_api';
import { getWord } from './goecoder';
import { getOrder } from '../../web/service/order.service';
import { convertAddressDto } from '../utils/coords';
import { TOrderDoc } from '../../web/models/order.model';

/*
convertIntoBoxes

@param{route} route document

@returns list of coded waypoints
 */
export const convertIntoBoxes = async (route: IRouteDoc) => {
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
  const optimalRoute = await makeOptimalRoute(waypoints);
  console.log(optimalRoute);
  if (optimalRoute === undefined) {
    return [];
  }
  const words = new Set<string>([]);
  for (let i = 0; i < optimalRoute.steps.length; i++) {
    const step = optimalRoute.steps[i];
    const word = await getWord('' + step[0], '' + step[1]);
    if (typeof word === "string") {
      words.add(word);
    }
  }

  return Array.from(words);
};
