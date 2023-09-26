import React from 'react';
import { Formik, Form } from 'formik';
import Button from '@mui/material/Button';
import { TextFieldComponent } from 'common/components';
import { formValidation } from '../login.validation';
import { Login, createEmptyLogin } from '../login.vm';
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
          <TextFieldComponent name="user" label="Usuario" />
          <TextFieldComponent
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
