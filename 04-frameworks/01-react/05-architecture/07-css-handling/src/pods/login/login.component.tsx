import React from "react";
import { Login, createEmptyLogin } from "./login.vm";
import { Formik, Form } from "formik";
import { InputFormik } from "@/common/components";
import { formValidation } from "./login.validation";
import css from "./login.styles.css";

interface Props {
  onLogin: (login: Login) => void;
}

export const LoginComponent: React.FC<Props> = (props) => {
  const { onLogin } = props;

  return (
    <Formik
      onSubmit={onLogin}
      initialValues={createEmptyLogin()}
      validate={formValidation.validateForm}
    >
      {() => (
        <Form>
          <div className={css.container}>
            <InputFormik name="username" placeholder="Username" />
            <InputFormik
              name="password"
              placeholder="Password"
              type="password"
            />
            <button type="submit">login</button>
          </div>
        </Form>
      )}
    </Formik>
  );
};
