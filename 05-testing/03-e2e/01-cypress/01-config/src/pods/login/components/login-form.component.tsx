import React from 'react';
import { Formik, Form } from 'formik';
import { Button } from '@mui/material';
import { TextField } from '#common/components';
import { Login, createEmptyLogin } from '../login.vm';
import { formValidation } from '../login.validations';
import * as classes from './login-form.styles';

interface Props {
  onLogin: (login: Login) => void;
}

export const LoginFormComponent: React.FunctionComponent<Props> = (props) => {
  const { onLogin } = props;
  return (
    <Formik
      onSubmit={onLogin}
      initialValues={createEmptyLogin()}
      validate={formValidation.validateForm}
    >
      {() => (
        <Form className={classes.root}>
          <TextField name="name" label="Name" />
          <TextField
            name="password"
            label="Password"
            type="password"
          />
          <Button type="submit" variant="contained" color="primary">
            Login
          </Button>
        </Form>
      )}
    </Formik>
  );
};
