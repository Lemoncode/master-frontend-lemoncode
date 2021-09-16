import * as mockRepository from './session.mock';
import { SessionRepositoryContract } from './session.contract';
// TODO: add here real repository

// TODO: Check here env variable if we are in mock mode or not
// and choose whether use the mock or the real version
export const sessionRepository: SessionRepositoryContract = mockRepository;
