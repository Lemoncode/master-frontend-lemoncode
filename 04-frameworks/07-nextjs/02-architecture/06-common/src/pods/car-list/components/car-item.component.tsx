import React from 'react';
import { useRouter } from 'next/router';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader/CardHeader';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import AvailableIcon from '@material-ui/icons/CheckCircle';
import BookedIcon from '@material-ui/icons/Cancel';
import { routeConstants } from 'core/constants';
import { Car } from '../car-list.vm';
import * as classes from './car-item.styles';

interface Props {
  car: Car;
}

export const CarItem: React.FunctionComponent<Props> = (props) => {
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
