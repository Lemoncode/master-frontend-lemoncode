import * as React from 'react';
import { HotelEntityVm } from './hotel-collection.vm';
import { HotelCard } from './components/hotel-card.component';
import * as classes from './hotel-collection.styles';

interface Props {
  hotelCollection: HotelEntityVm[];
}

export const HotelCollectionComponent: React.FunctionComponent<Props> = (
  props
) => {
  const { hotelCollection } = props;

  return (
    <ul className={classes.root}>
      {hotelCollection.map((hotel) => (
        <li key={hotel.id}>
          <HotelCard hotel={hotel} />
        </li>
      ))}
    </ul>
  );
};
