import React from 'react';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ carId: string }>;
}

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const params = await props.params;
  return {
    title: `Rent a car - Car ${params.carId} details`,
  };
};

const CarPage = async (props: Props) => {
  const params = await props.params;
  return (
    <>
      <h2>Car detail page</h2>
      <p>{params.carId}</p>
    </>
  );
};

export default CarPage;
