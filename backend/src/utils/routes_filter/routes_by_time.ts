import RouteModel from "../../models/route.model";
import { getInterval } from "../date";

export async function getNearestInTimeRoutes(route: any) {
    const timeInterval = getInterval(route.date, 1, 1);
    const nearestRoutes = RouteModel.find().where('date').in(timeInterval);
    if (!nearestRoutes) {
      return null;
    }
    return nearestRoutes;
  }