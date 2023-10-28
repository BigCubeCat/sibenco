export type TAddressDTO = {
  latitude?: string,
  longitude?: string,
  address?: string,
  OSRMNode?: string,
  // True, if object create in recover address, not from request
  confirmed: boolean,
};

const TAddressFromCoords = (lat: string, lon: string): TAddressDTO => {
  return {
    latitude: lat,
    longitude: lon,
    address: 'TODO',
    OSRMNode: 'TODO',
    confirmed: true,
  };
};

const TAddressOSRMNode = (node: string): TAddressDTO => {
  return {
    latitude: 'TODO',
    longitude: 'TODO',
    address: 'TODO',
    OSRMNode: node,
    confirmed: true,
  };
};

const TAddressFromAddress = (address: string): TAddressDTO => {
  return {
    latitude: 'TODO',
    longitude: 'TODO',
    address: address,
    OSRMNode: '',
    confirmed: true,
  };
};

export const recoverAddress = (address: TAddressDTO): TAddressDTO => {
  if (address.latitude && address.longitude) {
    return TAddressFromCoords(address.latitude, address.longitude);
  } else if (address.OSRMNode) {
    return TAddressOSRMNode(address.OSRMNode);
  }
  return TAddressFromAddress(address.address ? address.address : '');
};