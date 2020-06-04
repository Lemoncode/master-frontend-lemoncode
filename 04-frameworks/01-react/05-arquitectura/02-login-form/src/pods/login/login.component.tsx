import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

export const LoginComponent: React.FunctionComponent = () => {
  return (
    <Card>
      <CardHeader title="Login" />
      <CardContent>
        <form>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <TextField label="Name" margin="normal" />
            <TextField label="Password" type="password" margin="normal" />
            <Button type="submit" variant="contained" color="primary">
              Login
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
