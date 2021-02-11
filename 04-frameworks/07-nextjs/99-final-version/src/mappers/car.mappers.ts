import { envConstants } from '../common';
import * as apiModel from '../api';
import * as viewModel from '../models';

export const mapCarFromApiToVm = (car: apiModel.Car): viewModel.Car => ({
  id: car.id,
  name: car.name,
  imageUrl: `${envConstants.BASE_PICTURES_URL}${car.imageUrl}`,
  features: car.features,
  isBooked: car.isBooked,
});

export const mapCarListFromApiToVm = (
  carList: apiModel.Car[]
): viewModel.Car[] =>
  Array.isArray(carList) ? carList.map(mapCarFromApiToVm) : [];

export const mapCarFromVmToApi = (car: viewModel.Car): apiModel.Car => ({
  id: car.id,
  name: car.name,
  imageUrl: car.imageUrl.split(envConstants.BASE_PICTURES_URL)[1],
  features: car.features,
  isBooked: car.isBooked,
});
