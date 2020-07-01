import React from 'react';
import Rating from 'material-ui-rating';
import Typography from '@material-ui/core/Typography';

export const RatingComponent = props => {
  const { value, max, onChange, name, error } = props;

  const handleChange = value => {
    onChange(name, value);
  };
  return (
    <>
      <Rating value={value} max={max} onChange={handleChange} />
      <Typography variant="caption" color="error" gutterBottom>
        {error}
      </Typography>
    </>
  );
};
