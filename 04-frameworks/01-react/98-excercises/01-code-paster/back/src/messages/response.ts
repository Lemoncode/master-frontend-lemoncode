export const responseType = {
  CONNECTION_ACK: 'CONNECTION_ACK',
  APPEND_TEXT: 'APPEND_TEXT',
  REPLACE_FULL_TEXT: 'REPLACE_FULL_TEXT',
};

export interface ResponseBase {
  type: string;
  payload?: any;
}
