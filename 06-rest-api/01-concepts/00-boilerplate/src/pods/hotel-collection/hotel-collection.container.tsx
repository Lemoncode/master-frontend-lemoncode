import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { linkRoutes } from 'core/router';
import { deleteHotel } from './api';
import { useHotelCollection } from './hotel-collection.hook';
import { HotelCollectionComponent } from './hotel-collection.component';

export const HotelCollectionContainer = () => {
  const { hotelCollection, loadHotelCollection } = useHotelCollection();
  const navigate = useNavigate();

  React.useEffect(() => {
    loadHotelCollection();
  }, []);

  const handleCreateHotel = () => {
    navigate(linkRoutes.createHotel);
  };

  const handleEdit = (id: string) => {
    navigate(linkRoutes.editHotel(id));
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
