/**
 * @openapi
 * components:
 *  schemas:
 *      AddressDTO:
 *          type: object
 *          required:
 *              - address
 *              - latitude
 *              - longitude
 *              - pointType
 *          properties:
 *              address:
 *                  type: string
 *                  description: "Адресс точки"
 *              latitude:
 *                  type: number
 *                  description: "Широта"
 *                  format: float
 *              longitude:
 *                  type: number
 *                  description: "Долгота"
 *                  format: float
 *              pointType:
 *                  type: string
 *                  description: "Тип остановки: i - загрузка, o - разгрузка, b - и загрузка и разгрузка, n - ничего.\nНе используйте n на фронтенде"
 *                  enum:
 *                    - b
 *                    - i
 *                    - o
 *                    - n
 *                  default: n
 */
export type TAddressDTO = {
  latitude?: string,
  longitude?: string,
  address?: string,
  OSRMNode?: string,
  pointType: string,
  // True, if object create in recover address, not from request
  confirmed: boolean,
};

const TAddressFromCoords = (lat: string, lon: string, pointType: string): TAddressDTO => {
  return {
    latitude: lat,
    longitude: lon,
    address: 'TODO',
    OSRMNode: 'TODO',
    pointType: pointType,
    confirmed: true,
  };
};

const TAddressOSRMNode = (node: string): TAddressDTO => {
  return {
    latitude: 'TODO',
    longitude: 'TODO',
    address: 'TODO',
    OSRMNode: node,
    pointType: 'n',
    confirmed: true,
  };
};

const TAddressFromAddress = (address: string, pointType: string): TAddressDTO => {
  return {
    latitude: 'TODO',
    longitude: 'TODO',
    address: address,
    OSRMNode: '',
    pointType: pointType,
    confirmed: true,
  };
};

export const recoverAddress = (address: TAddressDTO): TAddressDTO => {
  address.pointType = address.pointType || 'n';
  if (address.latitude && address.longitude) {
    return TAddressFromCoords(address.latitude, address.longitude, address.pointType);
  } else if (address.OSRMNode) {
    return TAddressOSRMNode(address.OSRMNode);
  }

  return TAddressFromAddress(address.address ? address.address : '', address.pointType);
};

export const convertToOSM = (address: TAddressDTO) => {
  if (address.latitude && address.longitude) {
    return [Number(address.longitude), Number(address.latitude)];
  }
  address = recoverAddress(address);
  if (address.latitude && address.longitude) {
    return [Number(address.longitude), Number(address.latitude)];
  }
  return [0, 0];
}

export const getPointsCoords = (point: TAddressDTO) => {
      return {
        lat: Number(point.latitude), lon: Number(point.longitude), type: point.pointType
      };
}

