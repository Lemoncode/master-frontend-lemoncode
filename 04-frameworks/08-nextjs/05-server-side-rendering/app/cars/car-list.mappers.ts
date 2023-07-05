import { mapToCollection } from '@/_common/mappers';
import { envConstants } from '@/_core/constants';
import * as apiModel from './_api';
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
