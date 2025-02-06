# 03 Hotel edit

In this example we are going to add backend and frontend changes to GraphQL migration.

We will start from `02-graphql-frontend`.

Summary steps:

- Update backend.
- Update frontend.

# Steps to build it

- `npm install` to install previous sample packages:

```bash
npm install
```

# Steps

- Let's define `schema` for get one hotel by id:

### ./server/src/graphql/schema.ts

```diff
...

  type Query {
    hotels: [Hotel!]!
+   hotel(id: ID!): Hotel!
  }
`;

```

- Implement resolver:

### ./server/src/graphql/resolvers.ts

```diff
- import { getHotelList } from '#db/index.js';
+ import { getHotelList, getHotel } from '#db/index.js';
import { Hotel } from '#db/models/index.js';

export const resolvers = {
  hotels: async (): Promise<Hotel[]> => {
    const hotels = await getHotelList();
    return hotels;
  },
+   hotel: async (args): Promise<Hotel> => {
+     const hotel = await getHotel(args.id);
+     return hotel;
+   },
};

```

- We can play with graphql development tool at [http://localhost:3000/playground](http://localhost:3000/playground)

- Example query:

```graphql
query {
  hotel(id: "<replace-by-id>") {
    id
    name
    city
  }
}
```

- Now, it's time to update `hotel` api:

### ./src/pods/hotel/api/hotel.api.ts

```diff
import Axios from 'axios';
+ import { graphql } from '#core/api';
import { Hotel } from './hotel.api-model';
import { Lookup } from '#common/models';

const hotelListUrl = '/api/hotels';
const cityListUrl = '/api/cities';

+ interface GetHotelResponse {
+   hotel: Hotel;
+ }

export const getHotel = async (id: string): Promise<Hotel> => {
- const { data } = await Axios.get<Hotel>(`${hotelListUrl}/${id}`);
- return data;
+  const query = `
+    query($id: ID!) {
+      hotel(id: $id) {
+        id
+        name
+        shortDescription
+        hotelRating
+        address1
+        thumbNailUrl
+        city
+      }
+    }
+  `;

+  const { hotel } = await graphql<GetHotelResponse>({
+    query,
+    variables: { id },
+  });

+  return hotel;
};

...

```

> Check `Chrome Network` content size.

- Let's implement save hotel. We will create an [input](https://graphql.org/learn/schema/#input-types) type to model hotel editing fields:

### ./server/src/graphql/schema.ts

```diff
...

  type Query {
    hotels: [Hotel!]!
    hotel(id: ID!): Hotel!
  }

+ input HotelInput {
+   id: ID!
+   name: String!
+   address1: String!
+   city: String!
+   hotelRating: Float!
+   shortDescription: String!
+ }

+ type Mutation {
+   saveHotel(hotel: HotelInput!): Boolean
+ }
`;

```

- Let's implement the resolver:

### ./server/src/graphql/resolvers.ts

```diff
- import { getHotelList, getHotel } from '#db/index.js';
- import { Hotel} from '#db/models/index.js';
import { getHotelList, getHotel, updateHotel, insertHotel } from '#db/index.js';
import { Hotel, HotelEdit } from '#db/models/index.js';

+ interface SaveHotelArgs {
+   hotel: HotelEdit;
+ }

export const resolvers = {
    ...
+   saveHotel: async (args: SaveHotelArgs): Promise<boolean> => {
+    if (args.hotel.id) {
+      await updateHotel(args.hotel);
+    } else {
+      await insertHotel(args.hotel);
+    }
+    return true;
+  },
};

```

- Give a try using the following query at [http://localhost:3000/playground](http://localhost:3000/playground):

```graphql
mutation InsertHotel {
  saveHotel(
    hotel: {
      id: ""
      name: "New name"
      address1: "New address1"
      city: "California"
      hotelRating: 5
      shortDescription: "New shortDescription"
    }
  )
}

query GetHotels {
  hotels {
    id
    name
    address1
    city
    hotelRating
    shortDescription
  }
}

mutation UpdateHotel {
  saveHotel(
    hotel: {
      id: "<replace-by-id>"
      name: "Updated name"
      address1: "Updated address1"
      city: "Chicago"
      hotelRating: 5
      shortDescription: "Updated shortDescription"
    }
  )
}
```

- We can use a [variable](https://graphql.org/learn/queries/#variables) too:

```graphql
mutation UpdateHotel($hotel: HotelInput!) {
  saveHotel(hotel: $hotel)
}
```

`QUERY VARIABLES`

```json
{
  "hotel": {
    "id": "<replace-by-id>",
    "name": "Using variable name",
    "address1": "Using variable address1",
    "city": "Seattle",
    "hotelRating": 3,
    "shortDescription": "Using variable shortDescription"
  }
}
```

- Now, it's time to update `hotel` api again:

### ./src/pods/hotel/api/hotel.api.ts

```diff
...

+ interface SaveHotelResponse {
+   saveHotel: boolean;
+ }

export const saveHotel = async (hotel: Hotel): Promise<boolean> => {
- if (hotel.id) {
-   await Axios.patch<Hotel>(`${hotelListUrl}/${hotel.id}`, hotel);
- } else {
-   await Axios.post<Hotel>(hotelListUrl, hotel);
- }
- return true;
+ const query = `
+     mutation($hotel: HotelInput!) {
+       saveHotel(hotel: $hotel)
+     }
+   `;

+   const { saveHotel } = await graphql<SaveHotelResponse>({
+     query,
+     variables: { hotel },
+   });

+   return saveHotel;
};

```

## Exercises

- Migrate `getCities` to GraphQL.

### ./server/src/graphql/schema.ts

```diff
...

+ type City {
+   id: ID!
+   name: String!
+ }

  type Query {
    hotels: [Hotel!]!
    hotel(id: ID!): Hotel!
+   cities: [City!]!
  }

...
`;

```

- Implement resolver:

### ./server/src/graphql/resolvers.ts

```diff
- import { getHotelList, getHotel, updateHotel, insertHotel } from '#db/index.js';
- import { Hotel, HotelEdit } from '#db/models/index.js';
+ import {
+  getHotelList,
+  getHotel,
+  updateHotel,
+  insertHotel,
+  getCities,
+ } from '#db/index.js';
+ import { City, Hotel, HotelEdit } from '#db/models/index.js';

...

export const resolvers = {
  Query: {
    hotels: async (): Promise<Hotel[]> => {
      const hotels = await getHotelList();
      return hotels;
    },
    hotel: async (parent, args): Promise<Hotel> => {
      const hotel = await getHotel(args.id);
      return hotel;
    },
+   cities: async (): Promise<City[]> => {
+     const cities = await getCities();
+     return cities;
+   },
  },
...

```

### ./src/pods/hotel/api/hotel.api.ts

```diff
...

+ interface GetCitiesResponse {
+   cities: Lookup[];
+ }

export const getCities = async (): Promise<Lookup[]> => {
- const { data } = await Axios.get<Lookup[]>(cityListUrl);

- return data;
+ const query = `
+    query {
+      cities {
+        id
+        name
+      }
+    }
+  `;

+  const { cities } = await graphql<GetCitiesResponse>({
+    query,
+  });

+  return cities;
};

...
```

- Migrate `deleteHotel` to GraphQL.

### ./server/src/graphql/type-defs.ts

```diff
...

  type Mutation {
    saveHotel(hotel: HotelInput!): Boolean
+   deleteHotel(id: ID!): Boolean
  }
`;

```

- Implement resolver:

### ./server/src/graphql/resolvers.ts

```diff
import {
  getHotelList,
  getHotel,
  updateHotel,
  insertHotel,
  getCities,
+  deleteHotel,
} from '#db/index.js';

...
    ...
+   deleteHotel: async (args): Promise<boolean> => {
+    return await deleteHotel(args.id);
+  },
  },

...

```

### ./src/pods/hotel-collection/api/hotel-collection.api.ts

```diff
...

+ interface DeleteHotelResponse {
+   deleteHotel: boolean;
+ }

export const deleteHotel = async (id: string): Promise<boolean> => {
- await Axios.delete(`${url}/${id}`);
- return true;
+  const query = `
+    mutation($id: ID!) {
+     deleteHotel(id: $id)
+    }
+  `;

+  const { deleteHotel } = await graphql<DeleteHotelResponse>({
+    query,
+    variables: { id },
+  });
+  return deleteHotel;
};
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
