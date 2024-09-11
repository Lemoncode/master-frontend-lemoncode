'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

const CarListPage = () => {
  const router = useRouter();
  const onNavigateBack = () => {
    router.push('/'); // or router.back()
  };

  return (
    <>
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
