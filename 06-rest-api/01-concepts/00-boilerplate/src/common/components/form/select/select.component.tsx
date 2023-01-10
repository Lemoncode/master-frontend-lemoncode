import React from 'react';
import { useField } from 'formik';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectProps } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import { Lookup } from 'common/models';
import * as classes from './select.styles';

interface Props extends SelectProps {
  items: Lookup[];
  helperText?: string;
}

export const SelectComponent: React.FunctionComponent<Props> = (props) => {
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
  const targetValue =
    items.filter((x) => x.name === (value || field?.value))[0]?.name || '';

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
      <Select
        {...otherProps}
        classes={{
          select: classes.select,
        }}
        id={name}
        label={label}
        name={name}
        onChange={onChange || field?.onChange}
        onBlur={onBlur || field?.onBlur}
        value={targetValue}
      >
        {items.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            {item.name}
          </MenuItem>
        ))}
      </Select>
      {hasError && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
