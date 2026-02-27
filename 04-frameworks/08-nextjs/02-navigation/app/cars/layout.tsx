import { Metadata } from 'next';
import React from 'react';

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
