import React from "react";
import { useField } from "formik";
import TextField, { TextFieldProps } from "@mui/material/TextField";

// Input props, we got this value by double clicking on a input element
// and going to definition (d.ts)
export const TextFieldFormik: React.FC<TextFieldProps> = (props) => {
  // useField allows us to extract all formik metadata about that field
  const [field, meta] = useField(props.name);
  // If the field doesn't exist then treat this as a normal input
  const textFieldProps = Boolean(field) ? field : props;
  // We only want to display the field validation error messsage
  // if formik is enabled, and is the field has been touched
  // not a very good UX experience to show a blank form full
  // of error a the initial state
  const hasError = Boolean(meta && meta.touched && meta.error);

  return (
    <TextField
      variant="standard"
      {...props}
      name={textFieldProps.name}
      onChange={textFieldProps.onChange}
      onBlur={textFieldProps.onBlur}
      value={textFieldProps.value}
      error={hasError}
      helperText={hasError ? meta.error : ""}
      fullWidth={true}
      margin="normal"
    />
  );
};
