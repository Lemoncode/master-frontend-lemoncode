import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const CarPage = () => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Rent a car - Car {router.query.carId} details</title>
      </Head>
      <h2>Car detail page</h2>
      <p>{router.query.carId}</p>
    </>
  );
};

export default CarPage;
