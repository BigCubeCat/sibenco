import {IAddressDto} from '../../web/db/order.db';
import {getAddress} from '../geocoder/goecoder';

/*
convertAddressDto(coords)
@param{coords} Coords on map

if latitude and longitude not exists, get coords by word and return it;
@returns [longitude, latitude]
 */
export const convertAddressDto = async (coords: IAddressDto) => {
  if (!coords.latitude) {
    const address = await getAddress(coords.word);
    return [Number(address?.longitude), Number(address?.latitude)];
  }
  return [Number(coords?.longitude), Number(coords?.latitude)];
};
