import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { history, linkRoutes } from 'core/router';
import { createEmptyHotel, createEmptyHotelErrors } from './hotel-edit.vm';
import { formValidation } from './hotel-edit.validation';
import { getCities } from './api';
import { HotelEditComponent } from './hotel-edit.component';
import { coreActions } from 'core/store';

const InnerHotelEditContainer = props => {
  const { hotelId, hotelCollection, onUpdateHotelCollection } = props;
  const [hotel, setHotel] = React.useState(createEmptyHotel());
  const [hotelErrors, setHotelErrors] = React.useState(
    createEmptyHotelErrors()
  );
  const [cities, setCities] = React.useState([]);

  React.useEffect(() => {
    getCities().then(setCities);
  }, []);

  React.useEffect(() => {
    const selectedHotel = hotelCollection.find(h => h.id === hotelId);
    setHotel(selectedHotel ? selectedHotel : createEmptyHotel());
  }, [hotelId]);

  const onFieldUpdate = (fieldId, value) => {
    setHotel({
      ...hotel,
      [fieldId]: value,
    });

    formValidation.validateField(fieldId, value).then(validationResult => {
      setHotelErrors({
        ...hotelErrors,
        [fieldId]: validationResult,
      });
    });
  };

  const handleSave = () => {
    formValidation.validateForm(hotel).then(formValidationResult => {
      if (formValidationResult.succeeded) {
        const newHotelCollection = hotelCollection.map(h =>
          h.id === hotel.id
            ? {
                ...hotel,
              }
            : h
        );
        onUpdateHotelCollection(newHotelCollection);
        history.push(linkRoutes.hotelCollection);
      } else {
        setHotelErrors(formValidationResult.fieldErrors);
      }
    });
  };

  return (
    <HotelEditComponent
      hotel={hotel}
      cities={cities}
      onFieldUpdate={onFieldUpdate}
      hotelErrors={hotelErrors}
      onSave={handleSave}
    />
  );
};

const mapStateToProps = (state, ownProps) => ({
  hotelCollection: state.core.hotelCollection,
  hotelId: ownProps.match.params.id,
});

const mapDispatchToProps = dispatch => ({
  onUpdateHotelCollection: hotelCollection =>
    dispatch(coreActions.onUpdateHotelCollection(hotelCollection)),
});

export const HotelEditContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(InnerHotelEditContainer)
);
