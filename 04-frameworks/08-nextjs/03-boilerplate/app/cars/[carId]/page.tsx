import React from 'react';
import { Metadata } from 'next';

interface Props {
  params: { carId: string };
}

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const { params } = props;
  return {
    title: `Rent a car - Car ${params.carId} details`,
  };
};

const CarPage = (props: Props) => {
  const { params } = props;
  return (
    <>
      <h2>Car detail page</h2>
      <p>{params.carId}</p>
    </>
  );
};

export default CarPage;
