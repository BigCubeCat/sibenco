export type TMessages = {
  successCreate: string;
  successDelete: string;
  successUpdate: string;
  successClean: string;
};

const messages: TMessages = {
  successCreate: 'created successfully',
  successDelete: 'deleted successfully',
  successUpdate: 'updated successfully',
  successClean: 'deleted from cache successfully',
};

export default messages;
