import React from 'react';
import { connect } from 'react-redux';
import { HotelCollectionComponent } from './hotel-collection.component';
import { linkRoutes, history } from 'core/router';
import { useHotelCollection } from './use-hotel-collection.hook';
import { coreActions } from 'core/store';

const InnerHotelCollectionContainer = props => {
  const { hotelCollection, onUpdateHotelCollection } = props;
  const { onFetchHotelCollection } = useHotelCollection(
    hotelCollection,
    onUpdateHotelCollection
  );

  const handleEditHotel = hotelId => {
    const route = linkRoutes.hotelEdit(hotelId);
    history.push(route);
  };

  React.useEffect(() => {
    onFetchHotelCollection();
  }, []);

  return (
    <HotelCollectionComponent
      hotelCollection={hotelCollection}
      onEditHotel={handleEditHotel}
    />
  );
};

const mapStateToProps = state => ({
  hotelCollection: state.core.hotelCollection,
});

const mapDispatchToProps = dispatch => ({
  onUpdateHotelCollection: hotelCollection =>
    dispatch(coreActions.onUpdateHotelCollection(hotelCollection)),
});

export const HotelCollectionContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(InnerHotelCollectionContainer);
