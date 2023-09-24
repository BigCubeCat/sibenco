import fetch from 'node-fetch';

export const fetchApi = async <T>(
  address: string,
  method: string,
): Promise<T | undefined> => {
  try {
    const response = await fetch(address, {
      method: method,
    });

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof Error) {
      console.log('error message: ', error.message);
    } else {
      console.log('unexpected error: ', error);
    }
  }
};

export const fetchApiGet = async <T>(
  address: string,
): Promise<T | undefined> => {
  return fetchApi(address, 'GET');
};

export const fetchApiPost = async <T>(
  address: string,
): Promise<T | undefined> => {
  return fetchApi(address, 'POST');
};
