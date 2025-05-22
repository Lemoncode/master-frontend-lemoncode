import React from 'react';
import { Formik, Form } from 'formik';
import { Button } from '@mui/material';
import { TextField, Select, Rating } from '#common/components';
import { Lookup } from '#common/models';
import { formValidation } from './hotel-edit.validations';
import { Hotel } from './hotel-edit.vm';
import * as classes from './hotel-edit.styles';

interface Props {
  hotel: Hotel;
  cities: Lookup[];
  onSave: (hotel: Hotel) => void;
}

export const HotelEditComponent: React.FunctionComponent<Props> = (props) => {
  const { hotel, cities, onSave } = props;

  return (
    <Formik
      onSubmit={onSave}
      initialValues={hotel}
      enableReinitialize={true}
      validate={formValidation.validateForm}
    >
      {() => (
        <Form className={classes.root}>
          <TextField name="name" label="Name" />
          <TextField name="address" label="Address" />
          <img className={classes.picture} src={hotel.picture} />
          <Rating name="rating" max={5} />
          <Select name="city" label="City" items={cities} />
          <TextField
            name="description"
            label="Description"
            multiline={true}
            minRows={3}
            maxRows={5}
          />
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
        </Form>
      )}
    </Formik>
  );
};
