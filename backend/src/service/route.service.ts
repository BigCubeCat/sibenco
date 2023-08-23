import RouteModel, {I_RouterDocument} from '../models/route.model';

export async function createRoute(route: I_RouterDocument) {
  try {
    // get boxes
    return await RouteModel.create(route);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function patchRoute(id: string, route: I_RouterDocument) {
  try {
    return await RouteModel.findOneAndUpdate({_id: id}, route);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteRoute(id: string) {
  try {
    await RouteModel.findByIdAndRemove(id);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getRoute(id: string) {
  try {
    return await RouteModel.findOne({_id: id});
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAll(page: number, page_size: number) {
  try {
    const allRoutes = await RouteModel.find()
      .sort({_id: -1})
      .skip(page * page_size)
      .limit(page_size);
    if (!allRoutes) {
      throw new Error('not found');
    }
    return allRoutes;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
