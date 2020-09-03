export const responseType = {
  CONNECTION_ACK: 'CONNECTION_ACK',
  NEW_STORY: 'NEW_STORY',
  SHOW_VOTING_RESULTS: 'SHOW_VOTING_RESULTS'
};

export interface ResponseBase {
  type: string;
  payload?: any;
}
