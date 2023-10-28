import RouteModel, { I_RouterDocument } from "../../../web/models/route.model";
import { getInterval } from "../date";

export async function getNearestInTimeRoutes(route: I_RouterDocument): Promise<I_RouterDocument[] | null | undefined> {
    const timeInterval: number[] = getInterval(route.date, 1, 1);
    const nearestRoutes = RouteModel.find().and([{ 'date': { $gte: timeInterval[0] } }, { 'date': { $lte: timeInterval[1] } }]);
    if (!nearestRoutes) {
      return null;
    }
    return nearestRoutes;
}