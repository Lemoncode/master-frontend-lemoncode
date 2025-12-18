import { cars } from '#db';
import { createFileRoute } from '@tanstack/react-router';
import { json } from '@tanstack/react-start';

export const Route = createFileRoute('/api/cars/$id')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        return json(cars.find((c) => c.id === params.id));
      },
      PATCH: async ({ params, request }) => {
        const car = await request.json();
        const index = cars.findIndex((c) => c.id === params.id);
        if (index !== -1) {
          cars[index] = { ...cars[index], isBooked: car.isBooked };
        }
        return new Response(null, { status: 204 });
      },
    },
  },
});
