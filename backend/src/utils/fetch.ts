import fetch from 'node-fetch';

//Функция взятия контента при помощи get запроса через fetch
export const fetchApiGet = async <T>(
  address: string,
): Promise<T | undefined> => {
  try {
    const response = await fetch(address);

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
