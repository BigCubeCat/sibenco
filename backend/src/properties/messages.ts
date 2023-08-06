export type TMessages = {
  errorBadId: string,
  successCreate: string,
  successDelete: string,
  successUpdate: string
}

const messages: TMessages = {
  errorBadId: "Bad id",
  successCreate: "created successfully",
  successDelete: "deleted successfully",
  successUpdate: "updated successfully"
};

export default messages;