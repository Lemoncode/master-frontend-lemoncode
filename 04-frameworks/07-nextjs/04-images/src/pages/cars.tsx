import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { AppLayout, CarListComponent } from '../components';

const CarListPage = () => {
  const router = useRouter();
  const onNavigateBack = () => {
    router.push('/'); // or router.back()
  };

  return (
    <AppLayout>
      <Head>
        <title>Rent a car - Car list</title>
      </Head>
      <h2>Car list page</h2>
      <CarListComponent />
      <button onClick={onNavigateBack}>Navigate to home</button>
    </AppLayout>
  );
};

export default CarListPage;
