import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { linkRoutes } from 'core/router';
import { deleteHotel } from './api';
import { useHotelCollection } from './hotel-collection.hook';
import { HotelCollectionComponent } from './hotel-collection.component';

export const HotelCollectionContainer = () => {
  const { hotelCollection, loadHotelCollection } = useHotelCollection();
  const history = useHistory();

  React.useEffect(() => {
    loadHotelCollection();
  }, []);

  const handleCreateHotel = () => {
    history.push(linkRoutes.createHotel);
  };

  const handleEdit = (id: string) => {
    history.push(linkRoutes.editHotel(id));
  };

  const handleDelete = async (id: string) => {
    await deleteHotel(id);
    loadHotelCollection();
  };

  return (
    <HotelCollectionComponent
      hotelCollection={hotelCollection}
      onCreateHotel={handleCreateHotel}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
};
