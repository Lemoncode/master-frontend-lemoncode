import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import * as api from '../../api';
import { AppLayout, CarContainer } from '../../components';

interface Props {
  car: api.Car;
}

const CarPage: React.FunctionComponent<Props> = (props) => {
  const { car } = props;
  return (
    <AppLayout>
      <Head>
        <title>Rent a car - Car {car?.name} details</title>
      </Head>
      <CarContainer car={car} />
    </AppLayout>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const carId = context.params.carId as string;
  const car = await api.getCar(carId);
  console.log(`Fetch car: ${JSON.stringify(car, null, 2)}`);

  return {
    props: {
      car,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      { params: { carId: '1' } },
      { params: { carId: '2' } },
      { params: { carId: '3' } },
    ],
    fallback: true,
  };
};

export default CarPage;
