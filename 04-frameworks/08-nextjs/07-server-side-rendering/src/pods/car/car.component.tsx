import React from 'react';
import Image from 'next/image';
import { Typography, Button } from '@mui/material';
import { Car } from './car.vm';
import * as classes from './car.styles';

interface Props {
  car: Car;
  onBook: () => void;
}

export const CarComponent: React.FunctionComponent<Props> = (props) => {
  const { car, onBook } = props;

  return (
    <div className={classes.root}>
      <Typography className={classes.name} variant="h3">
        {car.name}
      </Typography>
      <div className={classes.image}>
        <Image
          src={car.imageUrl}
          layout="responsive"
          width={350}
          height={200}
        />
      </div>
      <ul className={classes.features}>
        {car.features.map((feature) => (
          <li key={feature}>
            <Typography variant="h6">{feature}</Typography>
          </li>
        ))}
      </ul>
      <Button
        className={classes.book}
        variant="contained"
        color={car.isBooked ? 'secondary' : 'primary'}
        onClick={onBook}
      >
        {car.isBooked ? 'Descartar reserva' : 'Reservar'}
      </Button>
    </div>
  );
};
