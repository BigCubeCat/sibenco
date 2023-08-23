import {I_RouterDocument} from '../models/route.model';
import {makeOptimalRoute} from '../route_machine_api';
import {RouteData} from '../route_machine_api/types';

export function generateBoxesRoute(route: I_RouterDocument) {
  const boxes: string[] = [];
  let optimalRoute: (RouteData | undefined);
  const fetchApi = async () => {
    optimalRoute = await makeOptimalRoute([[]]);
  };
  if (optimalRoute === undefined) {
    return [];
  }
  fetchApi().catch(console.error);
  return boxes;
}