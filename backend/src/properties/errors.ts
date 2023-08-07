export type TErrors = {
  BadId: string;
  Create: string;
  Update: string;
  Delete: string;
  NotFound: string;
};

const errors: TErrors = {
  BadId: 'bad id',
  Create: 'cant create ',
  Update: 'cant update ',
  Delete: 'cant delete ',
  NotFound: 'not found',
};

export default errors;
