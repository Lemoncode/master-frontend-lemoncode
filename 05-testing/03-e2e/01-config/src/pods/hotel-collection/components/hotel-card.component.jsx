import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar/Avatar';
import IconButton from '@material-ui/core/IconButton/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { useStyles } from './hotel-card.component.styles';

export const HotelCardComponent = props => {
  const { hotel, onEditHotel } = props;
  const classes = useStyles();
  return (
    <Card className={classes.container}>
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
            className={classes.media}
            image={hotel.picture}
            title={hotel.name}
          />
          <Typography variant="subtitle1" gutterBottom>
            {hotel.description}
          </Typography>
        </div>
      </CardContent>
      <CardActions>
        <IconButton
          aria-label="Add to favorites"
          onClick={() => onEditHotel(hotel.id)}
        >
          <EditIcon />
        </IconButton>
        <IconButton aria-label="Share">
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};
