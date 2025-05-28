import React from 'react';
import { useField } from 'formik';
import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  SelectProps,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { Lookup } from '#common/models';
import * as classes from './select.styles';

type Props = SelectProps & {
  items: Lookup[];
  helperText?: string;
};

export const SelectComponent: React.FC<Props> = (props) => {
  const {
    name,
    items,
    label,
    error,
    onChange,
    onBlur,
    value,
    className,
    ...otherProps
  } = props;
  const [field, meta] = Boolean(name) ? useField(name) : [];
  const hasError = error || Boolean(meta && meta.touched && meta.error);
  const helperText = Boolean(field) ? meta?.error : props.helperText;
  const labelId = `${name}-label`;

  return (
    <FormControl
      className={className}
      error={hasError}
      fullWidth={true}
      margin="normal"
    >
      <InputLabel htmlFor={name} id={labelId}>
        {label}
      </InputLabel>
      <MuiSelect
        {...otherProps}
        classes={{
          select: classes.select,
        }}
        labelId={labelId}
        label={label}
        name={name}
        onChange={onChange || field?.onChange}
        onBlur={onBlur || field?.onBlur}
        value={value || field?.value}
        slotProps={{
          input: {
            id: name,
          },
        }}
      >
        {items.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            {item.name}
          </MenuItem>
        ))}
      </MuiSelect>
      {hasError && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
