import { envConstants } from 'core/constants';
import * as apiModel from './api';
import * as viewModel from './car.vm';

export const mapCarFromApiToVm = (car: apiModel.Car): viewModel.Car =>
  Boolean(car)
    ? {
        id: car.id,
        name: car.name,
        imageUrl: `${envConstants.BASE_PICTURES_URL}${car.imageUrl}`,
        features: car.features,
        isBooked: car.isBooked,
      }
    : viewModel.createEmptyCar();

export const mapCarFromVmToApi = (car: viewModel.Car): apiModel.Car => ({
  id: car.id,
  name: car.name,
  imageUrl: car.imageUrl.split(envConstants.BASE_PICTURES_URL)[1],
  features: car.features,
  isBooked: car.isBooked,
});
