import RouteModel, { I_RouterDocument } from "../models/route.model";

export async function createRoute(route: I_RouterDocument) {
  try {
    const newRoute = await RouteModel.create(route);
    return newRoute
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getRoute(id: string) {
  try {
    const route = await RouteModel.findOne({ _id: id });
    if (!route) {
      throw new Error('Not found');
    }
    return route;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
