import React from 'react';
import { GetServerSideProps } from 'next';
import * as api from '../../api';
import { CarContainer, AppLayout } from '../../components';

interface Props {
  car: api.Car;
}

const CarListPage: React.FunctionComponent<Props> = (props) => {
  const { car } = props;
  return (
    <AppLayout>
      <CarContainer car={car} />
    </AppLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const carId = context.query.carId as string;
  const car = await api.getCar(carId);
  console.log({ car });

  return {
    props: {
      car,
    },
  };
};

export default CarListPage;
