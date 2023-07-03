import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rent a car - Car list',
};

interface Props {
  children: React.ReactNode;
}

const CarsLayout = (props: Props) => {
  const { children } = props;
  return children;
};

export default CarsLayout;
