import React from 'react';
import { useField } from 'formik';
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import * as classes from './checkbox.styles';

interface Props extends CheckboxProps {
  label?: string;
  labelPlacement?: 'end' | 'start' | 'top' | 'bottom';
  error?: boolean;
  helperText?: string;
}

export const CheckboxComponent: React.FunctionComponent<Props> = props => {
  const {
    label,
    labelPlacement,
    error,
    name,
    checked,
    onChange,
    onBlur,
    ...checkboxProps
  } = props;
  const [field, meta] = Boolean(name) ? useField(name) : [];
  const hasError = error || Boolean(meta && meta.touched && meta.error);
  const helperText = Boolean(field) ? meta?.error : props.helperText;

  return (
    <FormControl
      className={classes.root}
      error={hasError}
      fullWidth={true}
      margin="normal"
    >
      <FormControlLabel
        control={
          <Checkbox
            {...checkboxProps}
            name={name}
            checked={checked || field?.value}
            onChange={onChange || field?.onChange}
            onBlur={onBlur || field?.onBlur}
          />
        }
        label={label}
        labelPlacement={labelPlacement}
      />

      {hasError && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
