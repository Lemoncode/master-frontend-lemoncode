import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { AppLayout } from 'layouts';

const CarPage = () => {
  const router = useRouter();
  return (
    <AppLayout>
      <Head>
        <title>Rent a car - Car {router.query.carId} details</title>
      </Head>
      <h2>Car detail page</h2>
      <p>{router.query.carId}</p>
    </AppLayout>
  );
};

export default CarPage;
