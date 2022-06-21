import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Avatar,
  IconButton,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { linkRoutes } from 'core/router';
import { HotelEntityVm } from '../hotel-collection.vm';
import * as classes from './hotel-card.styles';

interface Props {
  hotel: HotelEntityVm;
}

export const HotelCard: React.FunctionComponent<Props> = (props) => {
  const { hotel } = props;
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader
        avatar={<Avatar aria-label="Hotel">{hotel.rating}</Avatar>}
        action={
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        }
        title={hotel.name}
        subheader={hotel.address}
      />
      <CardContent>
        <div className={classes.content}>
          <CardMedia
            image={hotel.picture}
            title={hotel.name}
            style={{ height: 0, paddingTop: '56.25%' }}
          />
          <Typography variant="subtitle1" gutterBottom>
            {hotel.description}
          </Typography>
        </div>
      </CardContent>
      <CardActions>
        <IconButton
          onClick={() => navigate(linkRoutes.hotelEdit(hotel.id))}
        >
          <EditIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};
