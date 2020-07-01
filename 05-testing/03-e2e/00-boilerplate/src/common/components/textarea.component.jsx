import React from 'react';
import { TextFieldComponent } from './text-field.component';

export const TextareaComponent = props => {
  const { name, label, onChange, value, error, rows, rowsMax } = props;

  return (
    <TextFieldComponent
      label={label}
      name={name}
      value={value}
      multiline={true}
      rows={rows}
      rowsMax={rowsMax}
      onChange={onChange}
      error={error}
    />
  );
};

TextareaComponent.defaultProps = {
  rows: 3,
  rowsMax: 5,
};
