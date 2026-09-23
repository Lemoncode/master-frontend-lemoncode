import { cars } from '#db';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/api/cars/')({
  server: {
    handlers: {
      GET: async () => {
        return Response.json(cars);
      },
    },
  },
});
