import React from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import * as api from '../api';
import { AppLayout, CarListContainer } from '../components';

interface Props {
  carList: api.Car[];
}

const CarListPage: React.FunctionComponent<Props> = (props) => {
  const { carList } = props;
  return (
    <AppLayout>
      <Head>
        <title>Rent a car - Car list</title>
      </Head>
      <CarListContainer carList={carList} />
    </AppLayout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const carList = await api.getCarList();
  console.log('Car list build time:', { carList });
  return {
    props: {
      carList,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every second
    revalidate: 10, // In seconds
  };
};
export default CarListPage;
