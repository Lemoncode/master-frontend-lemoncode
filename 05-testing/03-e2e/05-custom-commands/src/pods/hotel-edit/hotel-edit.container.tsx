import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import * as api from './api';
import { createEmptyHotel, Hotel } from './hotel-edit.vm';
import { mapHotelFromApiToVm } from './hotel-edit..mappers';
import { HotelEditComponent } from './hotel-edit.component';
import { Lookup } from 'common/models';

export const HotelEditContainer: React.FunctionComponent = (props) => {
  const [hotel, setHotel] = React.useState<Hotel>(createEmptyHotel());
  const [cities, setCities] = React.useState<Lookup[]>([]);
  const { id } = useParams();
  const history = useHistory();

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

  const handleSave = (hotel: Hotel) => {
    // TODO: implement it
    console.log({ hotel });
    history.goBack();
  };

  return (
    <HotelEditComponent hotel={hotel} cities={cities} onSave={handleSave} />
  );
};
