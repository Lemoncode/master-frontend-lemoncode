import React from "react";
import { Link, useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
});

interface MemberDetailEntity {
  id: string;
  login: string;
  avatar_url: string;
  name: string;
  company: string;
  bio: string;
}

const createDefaultMemberDetail = () => ({
  id: "",
  login: "",
  avatar_url: "",
  name: "",
  company: "",
  bio: "",
});

export const DetailPage: React.FC = () => {
  const [member, setMember] = React.useState<MemberDetailEntity>(
    createDefaultMemberDetail()
  );
  const { id } = useParams();
  const classes = useStyles();

  React.useEffect(() => {
    fetch(`https://api.github.com/users/${id}`)
      .then((response) => response.json())
      .then((json) => setMember(json));
  }, []);

  return (
    <>
      <Card className={classes.root}>
        <CardActionArea>
          <CardMedia
            className={classes.media}
            image={member.avatar_url}
            title="Contemplative Reptile"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {member.name}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {member.bio}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Link to="/list">
            <Button size="small" color="primary">
              Back to list page
            </Button>
          </Link>
        </CardActions>
      </Card>
    </>
  );
};
