import React from 'react';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import { useField } from 'formik';

interface Props {
  name: string;
  max: number;
  value?: string;
  onChange?: (value: number) => void;
  error?: boolean;
  helperText?: string;
}

export const RatingComponent: React.FunctionComponent<Props> = (props) => {
  const { name, max, value, onChange, error } = props;

  const [field, meta, helpers] = Boolean(name) ? useField(name) : [];
  const hasError = error || Boolean(meta && meta.error);
  const helperText = Boolean(field) ? meta?.error : props.helperText;

  const handleChange = (_, value: number) => {
    if (onChange) {
      onChange(value);
    } else {
      helpers.setValue(value);
    }
  };
  return (
    <>
      <Rating value={value || field?.value} max={max} onChange={handleChange} />
      {hasError && (
        <Typography variant="caption" color="error" gutterBottom>
          {helperText}
        </Typography>
      )}
    </>
  );
};
