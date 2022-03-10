import * as mockRepository from './profile.mock';
import { ProfileRepositoryContract } from './profile.contract';
// TODO: add here real repository

// TODO: Check here env variable if we are in mock mode or not
// and choose whether use the mock or the real version
export const profileRepository: ProfileRepositoryContract = mockRepository;
