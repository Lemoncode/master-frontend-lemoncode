import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const CarListPage = () => {
  const router = useRouter();
  const onNavigateBack = () => {
    router.push('/');
  };
  return (
    <>
      <Head>
        <title>Rent a car - Car list</title>
      </Head>
      <h2>Car list page</h2>
      <ul>
        <li>Audi Q8</li>
        <li>BMW X7</li>
      </ul>
      <button onClick={onNavigateBack}>Navigate to home</button>
    </>
  );
};

export default CarListPage;
