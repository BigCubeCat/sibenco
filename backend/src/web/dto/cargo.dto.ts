export type TCargoDTO = {
  unit: 'people' | 'good';
  count: number;
  description: string;
  price: number;
};

export const defaultCargo: TCargoDTO = {
  unit: 'good',
  count: 0,
  description: '',
  price: 0,
};