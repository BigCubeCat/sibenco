import axios from 'axios';

export const fetchApiGet = async <T>(
  address: string,
): Promise<T | undefined> => {
  const response = await axios.get(address);
  console.log(response.statusText);
  return response.data;
};

export const fetchApiPost = async <T>(
  address: string,
): Promise<T | undefined> => {
  const response = await axios.post(address);
  console.log(response.statusText);
  return response.data;
};
