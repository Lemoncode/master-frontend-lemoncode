import * as React from 'react';
import { useHistory } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar/Avatar';
import IconButton from '@material-ui/core/IconButton/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { HotelEntityVm } from '../hotel-collection.vm';
import * as classes from './hotel-card.styles';

interface Props {
  hotel: HotelEntityVm;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const HotelCard: React.FunctionComponent<Props> = (props) => {
  const { hotel, onEdit, onDelete } = props;

  return (
    <Card>
      <CardHeader
        avatar={<Avatar aria-label="Hotel">{hotel.rating}</Avatar>}
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
        <IconButton onClick={() => onEdit(hotel.id)}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => onDelete(hotel.id)}>
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};
