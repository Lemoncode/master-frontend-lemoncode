import React from 'react';
import { useField } from 'formik';
import { TextField as MuiTextField, TextFieldProps } from '@mui/material';

export const TextFieldComponent: React.FunctionComponent<TextFieldProps> = (
  props
) => {
  const { name, onChange, onBlur, value, error, inputProps } = props;

  const [field, meta] = Boolean(name) ? useField(name) : [];
  const hasError = error || Boolean(meta && meta.touched && meta.error);
  const helperText = Boolean(field) ? meta?.error : props.helperText;

  return (
    <MuiTextField
      {...props}
      name={name}
      id={name}
      onChange={onChange || field?.onChange}
      onBlur={onBlur || field?.onBlur}
      value={value || field?.value}
      error={hasError}
      helperText={hasError ? helperText : ''}
      fullWidth={true}
      margin="normal"
    />
  );
};
