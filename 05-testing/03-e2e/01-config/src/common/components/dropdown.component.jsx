import React from 'react';
import { TextFieldComponent } from './text-field.component';
import MenuItem from '@material-ui/core/MenuItem';

export const DropdownComponent = props => {
  const { name, label, onChange, value, error, type, list, disabled } = props;

  return (
    <TextFieldComponent
      label={label}
      name={name}
      value={value}
      type={type}
      select={true}
      onChange={onChange}
      disabled={disabled}
      error={error}
    >
      {list.map(collection => (
        <MenuItem key={collection.id} value={collection.id}>
          {collection.value}
        </MenuItem>
      ))}
    </TextFieldComponent>
  );
};

DropdownComponent.defaultProps = {
  type: 'text',
  disabled: false,
};
