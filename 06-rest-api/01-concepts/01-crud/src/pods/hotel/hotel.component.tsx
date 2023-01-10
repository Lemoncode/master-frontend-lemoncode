import React from 'react';
import { Formik, Form } from 'formik';
import Button from '@mui/material/Button';
import {
  TextFieldComponent,
  SelectComponent,
  RatingComponent,
} from 'common/components';
import { Lookup } from 'common/models';
import { formValidation } from './hotel.validations';
import { Hotel } from './hotel.vm';
import * as classes from './hotel.styles';

interface Props {
  hotel: Hotel;
  cities: Lookup[];
  onSave: (hotel: Hotel) => void;
}

export const HotelComponent: React.FunctionComponent<Props> = (props) => {
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
          <TextFieldComponent name="name" label="Name" />
          <TextFieldComponent name="address" label="Address" />
          <RatingComponent name="rating" max={5} />
          <SelectComponent name="city" label="City" items={cities} />
          <TextFieldComponent
            name="description"
            label="Description"
            multiline={true}
            rows={3}
          />
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
        </Form>
      )}
    </Formik>
  );
};
