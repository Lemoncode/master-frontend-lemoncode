# 01 CRUD

In this example we are going to replace mock API with real api requests, using json-server as mock server.

We will start from `00-boilerplate`.

# Steps to build it

- `npm install` to install previous sample packages:

```bash
npm install
```

- Run app:

```bash
npm start
```

## Update `getHotelCollection` API method

### Fetch version

_./src/pods/hotel-collection/api/hotel-collection.api.ts_

```diff
import { HotelEntityApi } from './hotel-collection.api-model';
import { mockHotelCollection } from './hotel-collection.mock-data';

let hotelCollection = [...mockHotelCollection];
+ const url = '/api/hotels';

export const getHotelCollection = async (): Promise<HotelEntityApi[]> => {
- return hotelCollection;
+ const response = await fetch(url);
+ if (response.ok) {
+   return await response.json();
+ } else {
+   throw Error(response.statusText);
+ }
};

...

```

### Axios version

_./src/pods/hotel-collection/api/hotel-collection.api.ts_

```diff
+ import axios from 'axios';
import { HotelEntityApi } from './hotel-collection.api-model';
import { mockHotelCollection } from './hotel-collection.mock-data';

let hotelCollection = [...mockHotelCollection];
+ const url = '/api/hotels';

export const getHotelCollection = async (): Promise<HotelEntityApi[]> => {
- return hotelCollection;
+ const { data } = await axios.get<HotelEntityApi[]>(url);
+ return data;
};

...

```

## Update `deleteHotel` API method

### Fetch version

_./src/pods/hotel-collection/api/hotel-collection.api.ts_

```diff
import { HotelEntityApi } from './hotel-collection.api-model';
- import { mockHotelCollection } from './hotel-collection.mock-data';

- let hotelCollection = [...mockHotelCollection];
const url = '/api/hotels';

...

export const deleteHotel = async (id: string): Promise<boolean> => {
- hotelCollection = hotelCollection.filter((h) => h.id !== id);
- return true;
+ const response = await fetch(`${url}/${id}`, { method: 'DELETE' });
+ return response.ok;
};

```

### Axios version

_./src/pods/hotel-collection/api/hotel-collection.api.ts_

```diff
import axios from 'axios';
import { HotelEntityApi } from './hotel-collection.api-model';
- import { mockHotelCollection } from './hotel-collection.mock-data';

- let hotelCollection = [...mockHotelCollection];
const url = '/api/hotels';

...

export const deleteHotel = async (id: string): Promise<boolean> => {
- hotelCollection = hotelCollection.filter((h) => h.id !== id);
+ await axios.delete(`${url}/${id}`);
  return true;
};

```

Delete `./src/pods/hotel-collection/api/hotel-collection.mock-data.ts`, not used.

## Update `getHotel` API method

### Fetch version

_./src/pods/hotel/api/hotel.api.ts_

```diff
import { Hotel } from './hotel.api-model';
import { Lookup } from 'common/models';
- import { mockCities, mockHotelCollection } from './hotel.mock-data';
+ import { mockCities } from './hotel.mock-data';

+ const hotelListUrl = '/api/hotels';

export const getHotel = async (id: string): Promise<Hotel> => {
- return mockHotelCollection.find((h) => h.id === id);
+ const response = await fetch(`${hotelListUrl}/${id}`);
+ if (response.ok) {
+   return await response.json();
+ } else {
+   throw Error(response.statusText);
+ }
};

...

```

### Axios version

_./src/pods/hotel/api/hotel.api.ts_

```diff
+ import axios from 'axios';
import { Hotel } from './hotel.api-model';
import { Lookup } from 'common/models';
- import { mockCities, mockHotelCollection } from './hotel.mock-data';
+ import { mockCities } from './hotel.mock-data';

+ const hotelListUrl = '/api/hotels';

export const getHotel = async (id: string): Promise<Hotel> => {
- return mockHotelCollection.find((h) => h.id === id);
+ const { data } = await axios.get<Hotel>(`${hotelListUrl}/${id}`);
+ return data;
};

...

```

## Update `getCities` API method

### Fetch version

_./src/pods/hotel/api/hotel.api.ts_

```diff
import { Hotel } from './hotel.api-model';
import { Lookup } from 'common/models';
- import { mockCities } from './hotel.mock-data';

const hotelListUrl = '/api/hotels';
+ const cityListUrl = '/api/cities';

...

export const getCities = async (): Promise<Lookup[]> => {
- return mockCities;
+ const response = await fetch(cityListUrl);
+ if (response.ok) {
+   return await response.json();
+ } else {
+   throw Error(response.statusText);
+ }
};

...

```

### Axios version

_./src/pods/hotel/api/hotel.api.ts_

```diff
import axios from 'axios';
import { Hotel } from './hotel.api-model';
import { Lookup } from 'common/models';
- import { mockCities } from './hotel.mock-data';

const hotelListUrl = '/api/hotels';
+ const cityListUrl = '/api/cities';

...

export const getCities = async (): Promise<Lookup[]> => {
- return mockCities;
+ const { data } = await axios.get<Lookup[]>(cityListUrl);
+ return data;
};

...

```

## Update `saveHotel` API method

### Fetch version

_./src/pods/hotel/api/hotel.api.ts_

```diff
...

export const saveHotel = async (hotel: Hotel): Promise<boolean> => {
+ if (hotel.id) {
+   await fetch(`${hotelListUrl}/${hotel.id}`, {
+     method: 'PUT',
+     headers: {
+       'Content-Type': 'application/json',
+     },
+     body: JSON.stringify(hotel),
+   });
+ } else {
+   await fetch(hotelListUrl, {
+     method: 'POST',
+     headers: {
+       'Content-Type': 'application/json',
+     },
+     body: JSON.stringify(hotel),
+   });
+ }
  return true;
};

```

### Axios version

_./src/pods/hotel/api/hotel.api.ts_

```diff
...

export const saveHotel = async (hotel: Hotel): Promise<boolean> => {
+ if (hotel.id) {
+   await axios.put<Hotel>(`${hotelListUrl}/${hotel.id}`, hotel);
+ } else {
+   await axios.post<Hotel>(hotelListUrl, hotel);
+ }
  return true;
};

```

Delete `./src/pods/hotel/api/hotel.mock-data.ts`, not used.

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
