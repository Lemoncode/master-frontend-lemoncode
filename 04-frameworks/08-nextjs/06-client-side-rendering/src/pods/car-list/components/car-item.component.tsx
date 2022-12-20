import React from 'react';
import { useRouter } from 'next/router';
import {
  Card,
  CardHeader,
  CardActionArea,
  CardContent,
  CardMedia,
} from '@mui/material';
import {
  CheckCircle as AvailableIcon,
  Cancel as BookedIcon,
} from '@mui/icons-material';
import { routeConstants } from 'core/constants';
import { Car } from '../car-list.vm';
import * as classes from './car-item.styles';

interface Props {
  car: Car;
}

export const CarItem: React.FC<Props> = (props) => {
  const { car } = props;
  const router = useRouter();

  return (
    <Card>
      <CardActionArea onClick={() => router.push(routeConstants.car(car.id))}>
        <CardHeader
          title={car.name}
          avatar={
            car.isBooked ? (
              <BookedIcon className={classes.bookedIcon} />
            ) : (
              <AvailableIcon className={classes.availableIcon} />
            )
          }
        />
        <CardContent>
          <CardMedia
            className={classes.cardMedia}
            image={car.imageUrl}
            title={car.name}
          />
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
