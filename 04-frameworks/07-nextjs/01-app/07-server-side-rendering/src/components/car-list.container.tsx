import React from 'react';
import * as api from '../api';
import { mapCarListFromApiToVm } from '../mappers';
import { CarListComponent } from './car-list.component';

interface Props {
  carList: api.Car[];
}

export const CarListContainer: React.FunctionComponent<Props> = (props) => {
  const carList = mapCarListFromApiToVm(props.carList);

  return <CarListComponent carList={carList} />;
};
