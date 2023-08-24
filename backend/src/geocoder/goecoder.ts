import {fetchApiGet, fetchApiPost} from '../utils/fetch';
import {config} from '../config';
import {AddressDto, WordDto} from './dto';

export const getWord = async (
  latitude: string, longitude: string, address = '',
) => {
  const resp = await fetchApiPost<WordDto>(
    `${config.geocoder.url}encode?latitude=${latitude}&longitude=${longitude}&address=${address}`,
  );
  if (!resp) {
    return;
  }
  return resp.word;
};

export const getAddress = async (word: string) => {
  const resp = await fetchApiGet<AddressDto>(
    `${config.geocoder.url}/decode?word=${word}`,
  );
  if (!resp) {
    return;
  }
  return {
    latitude: resp.latitude,
    longitude: resp.longitude,
    address: resp.address,
  };
};