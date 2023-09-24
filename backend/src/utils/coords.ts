import {IAddressDto} from '../models/order.model';
import {getAddress} from '../geocoder/goecoder';

export const convertAddressDto = async (coords: IAddressDto) => {
  if (!coords.latitude) {
    const address = await getAddress(coords.word);
    return [Number(address?.longitude), Number(address?.latitude)];
  }
  return [Number(coords?.longitude), Number(coords?.latitude)];
};
