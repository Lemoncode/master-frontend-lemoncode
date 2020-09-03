import { Router } from 'express';
import { generateNewRoomName, generateNewTrainerToken } from './business';

export const api = Router();

api.get('/create-room', async (req, res) => {
  const roomName = generateNewRoomName();
  const trainerToken = generateNewTrainerToken();
  res.send({ room: roomName, trainerToken: trainerToken });
});

api.post('/enroll-room', async (req, res) => {
  // TODO: ensure parameter is informed
  const roomName = req.body.name;

  res.send({ error: roomName });
});
