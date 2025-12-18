import { cars } from '#db';
import { createFileRoute } from '@tanstack/react-router';
import { json } from '@tanstack/react-start';

export const Route = createFileRoute('/api/cars/')({
  server: {
    handlers: {
      GET: async () => {
        return json(cars);
      },
    },
  },
});
