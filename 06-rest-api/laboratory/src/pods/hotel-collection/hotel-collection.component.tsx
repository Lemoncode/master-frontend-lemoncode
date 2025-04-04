import * as React from 'react';
import Button from '@mui/material/Button';
import { HotelEntityVm } from './hotel-collection.vm';
import { HotelCard } from './components/hotel-card.component';
import * as classes from './hotel-collection.styles';

interface Props {
  hotelCollection: HotelEntityVm[];
  onCreateHotel: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const HotelCollectionComponent: React.FunctionComponent<Props> = (
  props
) => {
  const { hotelCollection, onCreateHotel, onEdit, onDelete } = props;

  return (
    <div className={classes.root}>
      <Button variant="contained" color="primary" onClick={onCreateHotel}>
        Add hotel
      </Button>

      <ul className={classes.list}>
        {hotelCollection.map((hotel) => (
          <li key={hotel.id}>
            <HotelCard hotel={hotel} onEdit={onEdit} onDelete={onDelete} />
          </li>
        ))}
      </ul>
    </div>
  );
};
