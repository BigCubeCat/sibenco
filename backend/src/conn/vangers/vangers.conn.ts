import {fetchApiPostWithBody} from "../../sdk/utils/fetch";
import {TVangerDTO} from "../../web/dto/vanger.dto";
import {config} from "../../config";
import {TCargoDTO} from "../../web/dto/cargo.dto";
import {TDeadline} from "../../web/dto/deadline.dto";

export const getSuitableVanger = async (cargo: TCargoDTO, deadline: TDeadline, location: string) => {
  console.log('get su');
  return await fetchApiPostWithBody<TVangerDTO>(config.vangers.url + '/vangers/suitable/vanger', {
    maxNumberOfPassengers: cargo.count,
    maxAmountOfCargo: cargo.count,
    title: cargo.unit,
    location: location,
    beginDate: deadline.beginDate,
    endDate: deadline.endDate
  });
};
