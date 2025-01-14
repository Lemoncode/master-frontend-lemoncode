import * as React from 'react';
import { HotelCollectionComponent } from './hotel-collection.component';
import { useHotelCollection } from './hotel-collection.hook';

export const HotelCollectionContainer = () => {
  const { hotelCollection, loadHotelCollection } = useHotelCollection();

  React.useEffect(() => {
    loadHotelCollection();
  }, []);

  return <HotelCollectionComponent hotelCollection={hotelCollection} />;
};
