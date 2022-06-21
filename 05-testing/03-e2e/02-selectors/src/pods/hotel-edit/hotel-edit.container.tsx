import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from './api';
import { createEmptyHotel, Hotel } from './hotel-edit.vm';
import {
  mapHotelFromApiToVm,
  mapHotelFromVmToApi,
} from './hotel-edit..mappers';
import { HotelEditComponent } from './hotel-edit.component';
import { Lookup } from 'common/models';

export const HotelEditContainer: React.FunctionComponent = (props) => {
  const [hotel, setHotel] = React.useState<Hotel>(createEmptyHotel());
  const [cities, setCities] = React.useState<Lookup[]>([]);
  const { id } = useParams<any>();
  const navigate = useNavigate();

  const handleLoadData = async () => {
    const [apiHotel, apiCities] = await Promise.all([
      api.getHotel(id),
      api.getCities(),
    ]);
    setHotel(mapHotelFromApiToVm(apiHotel));
    setCities(apiCities);
  };

  React.useEffect(() => {
    handleLoadData();
  }, []);

  const handleSave = async (hotel: Hotel) => {
    const apiHotel = mapHotelFromVmToApi(hotel);
    const success = await api.saveHotel(apiHotel);
    if (success) {
      navigate(-1);
    } else {
      alert('Error on save hotel');
    }
  };

  return (
    <HotelEditComponent hotel={hotel} cities={cities} onSave={handleSave} />
  );
};
