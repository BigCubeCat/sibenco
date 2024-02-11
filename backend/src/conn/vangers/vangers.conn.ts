import {fetchApiDelete, fetchApiGet, fetchApiPostWithBody} from "../../sdk/utils/fetch";
import {TVangerDTO} from "../../web/dto/vanger.dto";
import {config} from "../../config";
import {TCargoDTO} from "../../web/dto/cargo.dto";
import {TDeadline} from "../../web/dto/deadline.dto";
import { TLocationDTO } from "../../web/dto/location.dto";

export const getSuitableVanger = async (cargo: TCargoDTO, deadline: TDeadline, location: TLocationDTO) => {
  try {
    const res = await fetchApiPostWithBody<TVangerDTO>(config.vangers.url + '/vangers/suitable/vanger', {
      maxNumberOfPassengers: cargo.numberOfPassengersInCar,
      maxAmountOfCargo: cargo.amountOfCargoInCar,
      title: cargo.unit,
      latitude: location.latitude,
      longitude: location.longitude,
      beginDate: deadline.beginDate,
      endDate: deadline.endDate,
      locationBorders: {
        latitude: {
          min: String(Number(location.latitude) - config.vangers.accuracyLat / 2),
          max: String(Number(location.latitude) + config.vangers.accuracyLat / 2)
        },
        longitude: {
          min: String(Number(location.longitude) - config.vangers.accuracyLong / 2),
          max: String(Number(location.longitude) + config.vangers.accuracyLong / 2)
        }        
      }
    });
    return res;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

export const getVangerById = async (id: string) => {
  try {
    const res = await fetchApiGet<TVangerDTO>(config.vangers.url + '/vangers/' + id);
    return res;
  } catch (error) {
    console.log(error);
    return undefined;
  }
  
}

export const deleteVanger = async (id: string) => {
  return await fetchApiDelete<string>(config.vangers.url + '/vangers/' + id);
}
