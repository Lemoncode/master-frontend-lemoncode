import React from 'react';
import { cx } from 'emotion';
import { useField } from 'formik';
import MuiTextField, {
  TextFieldProps as MuiTextFieldProps,
} from '@material-ui/core/TextField';
import * as innerClasses from './text-field.styles';

export interface TextFieldProps extends Omit<MuiTextFieldProps, 'variant'> {
  variant?: 'outlined' | 'filled' | 'standard';
}

export const TextFieldComponent: React.FunctionComponent<TextFieldProps> = (
  props
) => {
  const {
    id,
    name,
    onChange,
    onBlur,
    value,
    error,
    inputProps,
    variant,
    ...otherProps
  } = props;

  const [field, meta] = Boolean(name) ? useField(name) : [];
  const hasError = error || Boolean(meta && meta.touched && meta.error);
  const helperText = Boolean(props.helperText) ? props.helperText : meta?.error;
  const innerValue = Boolean(value) || value === '' ? value : field?.value;

  return (
    <MuiTextField
      {...otherProps}
      id={name || id}
      name={name}
      onChange={onChange || field?.onChange}
      onBlur={onBlur || field?.onBlur}
      value={innerValue}
      error={hasError}
      helperText={hasError ? helperText : ''}
      inputProps={{
        ...inputProps,
        className: cx(inputProps?.className, innerClasses.input),
      }}
      variant={variant}
    />
  );
};

TextFieldComponent.defaultProps = {
  margin: 'normal',
  fullWidth: true,
};
