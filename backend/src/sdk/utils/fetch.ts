import axios from 'axios';

export const fetchApiGet = async <T>(
  address: string,
): Promise<T | undefined> => {
  const response = await axios.get(address);
  console.log(response.statusText);
  return response.data;
};

export const fetchApiPost = async <T>(
  address: string
): Promise<T | undefined> => {
  const response = await axios.post(address);
  console.log(response.statusText);
  return response.data;
};


export const fetchApiPostWithBody = async <T>(
  address: string, body: object = {}
): Promise<T | undefined> => {
  console.log("fetch")
  console.log(address, body)
  const response = await axios.post(address, body, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  console.log(response.data);
  return response.data;
};
