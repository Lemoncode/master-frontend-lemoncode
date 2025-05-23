import React from 'react';
import { Rating as MuiRating, Typography } from '@mui/material';
import { useField } from 'formik';

interface Props {
  name: string;
  max: number;
  value?: string;
  onChange?: (value: string) => void;
  error?: boolean;
  helperText?: string;
}

export const Rating: React.FC<Props> = (props) => {
  const { name, max, value, onChange, error } = props;

  const [field, meta, helpers] = Boolean(name) ? useField(name) : [];
  const hasError = error || Boolean(meta && meta.error);
  const helperText = Boolean(field) ? meta?.error : props.helperText;

  const handleChange = (_, value) => {
    if (onChange) {
      onChange(value);
    } else {
      helpers.setValue(value);
    }
  };
  return (
    <>
      <MuiRating
        value={value || field?.value}
        max={max}
        onChange={handleChange}
      />
      {hasError && (
        <Typography variant="caption" color="error" gutterBottom>
          {helperText}
        </Typography>
      )}
    </>
  );
};
