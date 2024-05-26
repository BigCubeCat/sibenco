import {fetchApiDelete, fetchApiPostWithBody} from "../../sdk/utils/fetch";
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
      endDate: deadline.endDate
    });
    return res;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

export const deleteVanger = async (id: string) => {
  return await fetchApiDelete<string>(config.vangers.url + '/vangers/' + id);
}
