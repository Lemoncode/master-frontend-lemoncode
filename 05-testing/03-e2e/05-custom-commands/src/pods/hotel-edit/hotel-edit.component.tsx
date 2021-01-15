import React from 'react';
import { Formik, Form } from 'formik';
import {
  TextFieldComponent,
  SelectComponent,
  RatingComponent,
} from 'common/components';
import { Button } from '@material-ui/core';
import { formValidation } from './hotel-edit.validations';
import { Hotel } from './hotel-edit.vm';
import * as classes from './hotel-edit.styles';
import { Lookup } from 'common/models';

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
          <TextFieldComponent name="name" label="Name" />
          <TextFieldComponent name="address" label="Address" />
          <img className={classes.picture} src={hotel.picture} />
          <RatingComponent name="rating" max={5} />
          <SelectComponent name="city" label="City" items={cities} />
          <TextFieldComponent
            name="description"
            label="Description"
            multiline={true}
            rows={3}
            rowsMax={5}
          />
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
        </Form>
      )}
    </Formik>
  );
};
