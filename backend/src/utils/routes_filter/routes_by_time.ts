import RouteModel, { I_RouterDocument } from "../../models/route.model";
import { getInterval } from "../date";

export async function getNearestInTimeRoutes(route: I_RouterDocument): Promise<I_RouterDocument[] | null | undefined> {
    const timeInterval: string[] = getInterval(route.date, 1, 1);
    const nearestRoutes = RouteModel.find().where('date').in(timeInterval);
    if (!nearestRoutes) {
      return null;
    }
    return nearestRoutes;
}