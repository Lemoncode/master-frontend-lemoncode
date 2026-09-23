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
  return (
    <>
      <div
        style={{
          backgroundColor: 'teal',
          color: 'white',
        }}
      >
        Common layout
      </div>
      {children}
    </>
  );
};

export default CarsLayout;
