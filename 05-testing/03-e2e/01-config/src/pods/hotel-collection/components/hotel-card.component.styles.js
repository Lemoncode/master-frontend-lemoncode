import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
  container: {
    width: '500px',
    marginTop: theme.spacing(3),
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  media: {
    height: 0,
    paddingTop: '56.25%',
  },
}));
