# 01 CRUD

In this example we are going to replace mock API with real api requests, using json-server as mock server.

We will start from `00-boilerplate`.

Summary steps:

- Install `jest`.
- Add configuration.
- Add dummy spec.
- External jest config file.

# Steps to build it

- `npm install` to install previous sample packages:

```bash
npm install
```

- Run app:

```bash
npm start
```

- Update `getHotelCollection` api method:

_./src/pods/hotel-collection/api/hotel-collection.api.ts_

```diff
+ import Axios from 'axios';
import { HotelEntityApi } from './hotel-collection.api-model';
import { mockHotelCollection } from './hotel-collection.mock-data';

let hotelCollection = [...mockHotelCollection];
+ const url = '/api/hotels';

export const getHotelCollection = async (): Promise<HotelEntityApi[]> => {
- return hotelCollection;
+ const { data } = await Axios.get<HotelEntityApi[]>(url);
+ return data;
};

...

```

- Update `deleteHotel` api method:

> NOTE: There is an issue with delete method
> Check [issue](https://github.com/typicode/json-server/issues/760)

_./src/pods/hotel-collection/api/hotel-collection.api.ts_

```diff
import Axios from 'axios';
import { HotelEntityApi } from './hotel-collection.api-model';
- import { mockHotelCollection } from './hotel-collection.mock-data';

- let hotelCollection = [...mockHotelCollection];
const url = '/api/hotels';

export const getHotelCollection = async (): Promise<HotelEntityApi[]> => {
  const { data } = await Axios.get<HotelEntityApi[]>(url);

  return data;
};

+ // json-server delete issue: It deletes all collection instead of single one.
+ // https://github.com/typicode/json-server/issues/760
export const deleteHotel = async (id: string): Promise<boolean> => {
- hotelCollection = hotelCollection.filter((h) => h.id !== id);
- await Axios.delete(`${url}/${id}`);
  return true;
};

```

- Delete `./src/pods/hotel-collection/api/hotel-collection.mock-data.ts`, not used.

- Update `getHotel` api method:

_./src/pods/hotel/api/hotel.api.ts_

```diff
+ import Axios from 'axios';
import { Hotel } from './hotel.api-model';
import { Lookup } from 'common/models';
- import { mockCities, mockHotelCollection } from './hotel.mock-data';
+ import { mockCities } from './hotel.mock-data';

+ const hotelListUrl = '/api/hotels';

export const getHotel = async (id: string): Promise<Hotel> => {
- return mockHotelCollection.find((h) => h.id === id);
+ const { data } = await Axios.get<Hotel>(`${hotelListUrl}/${id}`);

+ return data;
};

...

```

- Update `getCities` api method:

_./src/pods/hotel/api/hotel.api.ts_

```diff
import Axios from 'axios';
import { Hotel } from './hotel.api-model';
import { Lookup } from 'common/models';
- import { mockCities } from './hotel.mock-data';

const hotelListUrl = '/api/hotels';
+ const cityListUrl = '/api/cities';

...

export const getCities = async (): Promise<Lookup[]> => {
- return mockCities;
+ const { data } = await Axios.get<Lookup[]>(cityListUrl);

+ return data;
};

...

```

- Update `saveHotel` api method:

_./src/pods/hotel/api/hotel.api.ts_

```diff
...

export const saveHotel = async (hotel: Hotel): Promise<boolean> => {
+ if (hotel.id) {
+   await Axios.put<Hotel>(`${hotelListUrl}/${hotel.id}`, hotel);
+ } else {
+   await Axios.post<Hotel>(hotelListUrl, hotel);
+ }
  return true;
};

```

- Delete `./src/pods/hotel/api/hotel.mock-data.ts`, not used.

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
