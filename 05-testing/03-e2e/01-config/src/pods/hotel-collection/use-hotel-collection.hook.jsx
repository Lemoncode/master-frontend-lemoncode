import { fetchHotelCollection } from './hotel-collection.api';
import { mapFromApiToVm } from './hotel-collection.mapper';
import { mapCollection } from 'common/mappers';

// TODO: Now it's not a custom hook, it's a simple function. Maybe we want to trace it on Redux.
// In that case, we will need redux-thunk or redux-sagas
export const useHotelCollection = (
  hotelCollection,
  onUpdateHotelCollection
) => {
  const onFetchHotelCollection = () => {
    if (hotelCollection.length === 0) {
      fetchHotelCollection().then(hotels =>
        onUpdateHotelCollection(mapCollection(hotels, mapFromApiToVm))
      );
    }
  };

  return { onFetchHotelCollection };
};
