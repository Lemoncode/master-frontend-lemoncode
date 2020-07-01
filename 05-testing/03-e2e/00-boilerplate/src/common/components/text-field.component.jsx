import React from 'react';
import TextField from '@material-ui/core/TextField';

export const TextFieldComponent = props => {
  const {
    name,
    label,
    onChange,
    value,
    error,
    type,
    onBlur,
    select,
    disabled,
    multiline,
    rows,
    rowsMax,
    placeholder,
    children,
  } = props;

  const handleChange = e => {
    onChange(name, e.target.value);
  };

  const handleBlur = e => {
    if (onBlur) {
      onBlur(name, e.target.value);
    }
  };

  return (
    <TextField
      label={label}
      margin="normal"
      value={value}
      type={type}
      onChange={handleChange}
      onBlur={handleBlur}
      error={Boolean(error)}
      helperText={error}
      select={select}
      disabled={disabled}
      multiline={multiline}
      rows={rows}
      rowsMax={rowsMax}
      placeholder={placeholder}
    >
      {children}
    </TextField>
  );
};

TextFieldComponent.defaultProps = {
  type: 'text',
};
