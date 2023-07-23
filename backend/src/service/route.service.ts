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

export async function patchRoute(id: string, route: I_RouterDocument) {
  try {
    const newRoute = await RouteModel.findOneAndUpdate({ _id: id }, route);
    return newRoute
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteRoute(id: string) {
  try {
    await RouteModel.findByIdAndRemove(id)
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getRoute(id: string) {
  try {
    const route = await RouteModel.findOne({ _id: id });
    if (!route) {
      throw new Error('not found');
    }
    return route;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAll(page: number, page_size: number) {
  try {
    const allRoutes = await RouteModel.find().sort({ _id: -1 }).skip(page * page_size).limit(page_size);
    if (!allRoutes) {
      throw new Error("not found")
    }
    return allRoutes
  } catch (error) {
    console.log(error);
    throw error;
  }
}
