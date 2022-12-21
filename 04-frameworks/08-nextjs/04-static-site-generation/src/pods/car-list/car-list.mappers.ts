import { mapToCollection } from 'common/mappers';
import { envConstants } from 'core/constants';
import * as apiModel from './api';
import * as viewModel from './car-list.vm';

export const mapCarListFromApiToVm = (
  carList: apiModel.Car[]
): viewModel.Car[] => mapToCollection(carList, mapCarFromApiToVm);

const mapCarFromApiToVm = (car: apiModel.Car): viewModel.Car => ({
  id: car.id,
  name: car.name,
  imageUrl: `${envConstants.BASE_PICTURES_URL}${car.imageUrl}`,
  isBooked: car.isBooked,
});
