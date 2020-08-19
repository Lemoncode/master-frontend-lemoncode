import React from 'react';
import { Formik, Form } from 'formik';
import Button from '@material-ui/core/Button';
import { TextFieldComponent } from 'common/components';
import { Login, createEmptyLogin } from '../login.vm';
import { formValidation } from '../login.validation';
import * as classes from './login-form.styles';
import { literals } from 'core/i18n';

interface Props {
  onLogin: (login: Login) => void;
}

export const LoginFormComponent: React.FunctionComponent<Props> = props => {
  const { onLogin } = props;
  return (
    <Formik
      onSubmit={onLogin}
      initialValues={createEmptyLogin()}
      validate={formValidation.validateForm}
    >
      {() => (
        <Form className={classes.root}>
          <TextFieldComponent
            name="user"
            label={`${literals.components.fields.user} *`}
            variant="outlined"
          />
          <TextFieldComponent
            name="password"
            label={`${literals.components.fields.password} *`}
            type="password"
            variant="outlined"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Login
          </Button>
        </Form>
      )}
    </Formik>
  );
};
