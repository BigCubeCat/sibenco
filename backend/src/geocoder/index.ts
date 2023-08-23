import {I_RouterDocument} from '../models/route.model';
import {makeOptimalRoute} from '../route_machine_api';
import {getWord} from './goecoder';


const convertIntoBoxes = async (route: I_RouterDocument) => {
  const optimalRoute = await makeOptimalRoute([[]]);
  if (optimalRoute === undefined) {
    return [];
  }
  let words = new Set<string>([]);
  for (let i = 0; i < optimalRoute.steps.length; i++) {
    const step = optimalRoute.steps[i];
    const word = await getWord('' + step[0], '' + step[1], '');
    words.add(word);
  }

  return Array.from(words.values());
};

export function generateBoxesRoute(route: I_RouterDocument) {
  let boxes: string[] = [];
  const fetchConvert = async () => {
    boxes = await convertIntoBoxes(route);
  }
  fetchConvert().catch(console.error);
  return boxes;
}