import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Login, createEmptyLogin } from './login.vm';

interface Props {
  onLogin: (login: Login) => void;
}

export const LoginComponent: React.FunctionComponent<Props> = props => {
  const { onLogin } = props;
  const [login, setLogin] = React.useState<Login>(createEmptyLogin());

  return (
    <Card>
      <CardHeader title="Login" />
      <CardContent>
        <form
          onSubmit={e => {
            e.preventDefault();
            onLogin(login);
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <TextField
              label="Name"
              margin="normal"
              value={login.user}
              onChange={e => setLogin({ ...login, user: e.target.value })}
            />
            <TextField
              label="Password"
              type="password"
              margin="normal"
              value={login.password}
              onChange={e => setLogin({ ...login, password: e.target.value })}
            />
            <Button type="submit" variant="contained" color="primary">
              Login
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
