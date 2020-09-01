import { Hotel } from './hotel.api-model';
import { Lookup } from 'common/models';

export const mockHotelCollection: Hotel[] = [
  {
    id: '1',
    type: 'hotel',
    name: 'W Seattle',
    created: new Date(1464777092747),
    modified: new Date(1464777092747),
    address1: '1112 4th Ave',
    airportCode: 'SEA',
    amenityMask: 7798785,
    city: 'Seattle',
    confidenceRating: 5,
    countryCode: 'US',
    deepLink:
      'http://www.travelnow.com/templates/55505/hotels/213497/overview?lang=en&amp;currency=USD&amp;standardCheckin=null/null/null&amp;standardCheckout=null/null/null',
    highRate: 210,
    hotelId: 213497,
    hotelInDestination: true,
    hotelRating: 4,
    location: {
      latitude: 47.60688,
      longitude: -122.33361,
    },
    locationDescription: 'Near Pike Place Market',
    lowRate: 175,
    metadata: {
      path: '/hotels/8',
    },
    postalCode: 98101,
    propertyCategory: 1,
    proximityDistance: 11.09939,
    proximityUnit: 'MI',
    rateCurrencyCode: 'USD',
    shortDescription:
      'With a stay at W Seattle, you&apos;ll be centrally located in Seattle, steps from Seattle Public Library and Safeco Headquarters. This 4-star hotel is close to Pike Place',
    stateProvinceCode: 'WA',
    thumbNailUrl: '/thumbnails/284304_50_t.jpg',
    tripAdvisorRating: 4,
    tripAdvisorRatingUrl:
      'http://www.tripadvisor.com/img/cdsi/img2/ratings/traveler/4.0-12345-4.gif',
  },
  {
    id: '2',
    type: 'hotel',
    name: 'Hotel Monaco Seattle, a Kimpton Hotel',
    created: new Date(1464777092694),
    modified: new Date(1464777092694),
    address1: '1101 4th Ave',
    airportCode: 'SEA',
    amenityMask: 1310720,
    city: 'Seattle',
    confidenceRating: 52,
    countryCode: 'US',
    deepLink:
      'http://www.travelnow.com/templates/55505/hotels/132138/overview?lang=en&amp;currency=USD&amp;standardCheckin=null/null/null&amp;standardCheckout=null/null/null',
    highRate: 489,
    hotelId: 132138,
    hotelInDestination: true,
    hotelRating: 4,
    location: {
      latitude: 47.60682,
      longitude: -122.33358,
    },
    locationDescription: 'Near Pike Place Market',
    lowRate: 189,
    metadata: {
      path: '/hotels/6',
    },
    postalCode: 98101,
    propertyCategory: 1,
    proximityDistance: 11.097676,
    proximityUnit: 'MI',
    rateCurrencyCode: 'USD',
    shortDescription:
      'With a stay at Hotel Monaco Seattle, a Kimpton Hotel, you&apos;ll be centrally located in Seattle, steps from Seattle Public Library and Safeco Headquarters. This 4-star',
    stateProvinceCode: 'WA',
    thumbNailUrl: '/thumbnails/62800_122_t.jpg',
    tripAdvisorRating: 4.5,
    tripAdvisorRatingUrl:
      'http://www.tripadvisor.com/img/cdsi/img2/ratings/traveler/4.5-12345-4.gif',
  },
];

export const mockCities: Lookup[] = [
  {
    id: 'Seattle',
    name: 'Seattle',
  },
  {
    id: 'New York',
    name: 'New York',
  },
];
