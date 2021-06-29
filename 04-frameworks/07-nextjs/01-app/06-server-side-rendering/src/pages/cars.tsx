import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import * as api from '../api';
import { AppLayout, CarListContainer } from '../components';

interface Props {
  carList: api.Car[];
}

const CarListPage: React.FunctionComponent<Props> = (props) => {
  const { carList } = props;
  console.log('Render car list Page');

  return (
    <AppLayout>
      <Head>
        <title>Rent a car - Car list</title>
      </Head>
      <CarListContainer carList={carList} />
    </AppLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const carList = await api.getCarList();
  console.log('Car list build time:', { carList });
  return {
    props: {
      carList,
    },
  };
};
export default CarListPage;
