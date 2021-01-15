import Axios from 'axios';

const baseApiUrl = 'http://localhost:8081';

const getRoomUrl = `${baseApiUrl}/api/create-room`;

interface SessionInfo {
  room: string;
  trainerToken: string;
}

export const createRoom = async (): Promise<SessionInfo> => {
  // TODO Error handling
  const result = await Axios.get(getRoomUrl);

  return result.data;
};
