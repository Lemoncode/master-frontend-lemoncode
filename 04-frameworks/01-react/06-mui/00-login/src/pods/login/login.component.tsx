import React from "react";
import { Login, createEmptyLogin } from "./login.vm";
import { Formik, Form } from "formik";
import { InputFormik, TextFieldFormik } from "@/common/components";
import { formValidation } from "./login.validation";
import css from "./login.styles.css";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";

interface Props {
  onLogin: (login: Login) => void;
}

export const LoginComponent: React.FC<Props> = (props) => {
  const { onLogin } = props;

  return (
    <Card sx={{ padding: "20px" }}>
      <CardHeader title="Login" />
      <CardContent>
        <Formik
          onSubmit={onLogin}
          initialValues={createEmptyLogin()}
          validate={formValidation.validateForm}
        >
          {() => (
            <Form>
              <div className={css.container}>
                <TextFieldFormik name="username" placeholder="Username" />
                <TextFieldFormik
                  name="password"
                  placeholder="Password"
                  type="password"
                />
                <Button variant="contained" type="submit">
                  login
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
};
