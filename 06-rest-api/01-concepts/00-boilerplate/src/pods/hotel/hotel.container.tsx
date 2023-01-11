import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from './api';
import { createEmptyHotel, Hotel } from './hotel.vm';
import { mapHotelFromApiToVm, mapHotelFromVmToApi } from './hotel.mappers';
import { Lookup } from 'common/models';
import { HotelComponent } from './hotel.component';

export const HotelContainer: React.FunctionComponent = (props) => {
  const [hotel, setHotel] = React.useState<Hotel>(createEmptyHotel());
  const [cities, setCities] = React.useState<Lookup[]>([]);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleLoadCityCollection = async () => {
    const apiCities = await api.getCities();
    setCities(apiCities);
  };

  const handleLoadHotel = async () => {
    const apiHotel = await api.getHotel(id);
    setHotel(mapHotelFromApiToVm(apiHotel));
  };

  React.useEffect(() => {
    if (id) {
      handleLoadHotel();
    }
    handleLoadCityCollection();
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

  return <HotelComponent hotel={hotel} cities={cities} onSave={handleSave} />;
};
