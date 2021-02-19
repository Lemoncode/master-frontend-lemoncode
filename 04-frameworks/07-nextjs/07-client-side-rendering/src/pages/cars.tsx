import React from 'react';
import useSWR from 'swr';
import Head from 'next/head';
import * as api from '../api';
import { AppLayout, CarListContainer } from '../components';

const CarListPage: React.FunctionComponent = () => {
  const { data } = useSWR(api.url, api.getCarList);
  const carList = data || [];

  console.log(`Render car list: ${carList.length}`);
  return (
    <AppLayout>
      <Head>
        <title>Rent a car - Car list</title>
      </Head>
      <CarListContainer carList={carList} />
    </AppLayout>
  );
};

export default CarListPage;
