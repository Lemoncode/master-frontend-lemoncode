import * as React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(
  createStyles({
    card: {
      maxWidth: 300,
    },
  })
);

interface Props {
  title: string;
  body: string;
  onClick: () => void;
}

export const CardComponent: React.FunctionComponent<Props> = props => {
  const { title, body, onClick } = props;
  const classes = useStyles(props);

  return (
    <Card className={classes.card}>
      <CardHeader title={title} />
      <CardContent>{body}</CardContent>
      <CardActions>
        <Button color="primary" onClick={onClick}>
          Learn more
        </Button>
      </CardActions>
    </Card>
  );
};
