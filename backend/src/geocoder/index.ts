import {I_RouterDocument} from '../models/route.model';
import {makeOptimalRoute} from '../route_machine_api';
import {getWord} from './goecoder';
import {getOrder} from '../service/order.service';
import {convertAddressDto} from '../utils/coords';
import {TOrderDoc} from '../models/order.model';


const convertIntoBoxes = async (route: I_RouterDocument) => {
  const waypoints: number[][] = [];
  for (let i = 0; i < route.route.orders.length; i++) {
    const orderId = route.route.orders[i];
    const order: (TOrderDoc | null) = await getOrder(orderId);
    if (!order) continue;
    waypoints.push(await convertAddressDto(order.route.loadingAddress));
    waypoints.push(await convertAddressDto(order.route.unloadingAddress));
  }
  const optimalRoute = await makeOptimalRoute(waypoints);
  if (optimalRoute === undefined) {
    return [];
  }
  const words = new Set<string>([]);
  for (let i = 0; i < optimalRoute.steps.length; i++) {
    const step = optimalRoute.steps[i];
    const word = await getWord('' + step[0], '' + step[1]);
    if (word)
      words.add(word);
  }

  return Array.from(words.values());
};

export function generateBoxesRoute(route: I_RouterDocument) {
  let boxes: string[] = [];
  const fetchConvert = async () => {
    boxes = await convertIntoBoxes(route);
  };
  fetchConvert().catch(console.error);
  return boxes;
}