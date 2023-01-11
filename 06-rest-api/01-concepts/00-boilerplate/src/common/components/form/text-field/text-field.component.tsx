import React from 'react';
import { cx } from '@emotion/css';
import { useField } from 'formik';
import MuiTextField, { TextFieldProps } from '@mui/material/TextField';
import * as classes from './text-field.styles';

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
      inputProps={{
        ...inputProps,
        className: cx(inputProps?.className, classes.input),
      }}
    />
  );
};
