import React from 'react';
import { GetServerSideProps } from 'next';
import * as api from '../api';
import { CarListContainer, AppLayout } from '../components';

interface Props {
  carList: api.Car[];
}

const CarListPage: React.FunctionComponent<Props> = (props) => {
  const { carList } = props;
  return (
    <AppLayout>
      <CarListContainer carList={carList} />
    </AppLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const carList = await api.getCarList();

  return {
    props: {
      carList,
    },
  };
};

export default CarListPage;
