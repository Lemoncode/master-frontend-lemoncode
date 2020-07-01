import React from 'react';
import { HotelCardComponent } from './components';
import { useStyles } from './hotel-collection.component.styles';

export const HotelCollectionComponent = props => {
  const { hotelCollection, onEditHotel } = props;
  const classes = useStyles();

  return (
    <div className={classes.container}>
      {hotelCollection.map(hotel => (
        <HotelCardComponent
          key={hotel.id}
          hotel={hotel}
          onEditHotel={onEditHotel}
        />
      ))}
    </div>
  );
};
