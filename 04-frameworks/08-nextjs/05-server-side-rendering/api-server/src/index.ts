import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { cars } from './mock-data';

let db = {
  cars,
};

const app = new Hono();
app.use(logger());
app.use('/*', serveStatic({ root: './public' }));

app.use('/api/*', cors());

app.get('/api/cars', (context) => {
  return context.json(db.cars);
});

app.get('/api/cars/:id', (context) => {
  return context.json(db.cars.find((c) => c.id === context.req.param('id')));
});

app.put('/api/cars/:id', async (context) => {
  const id = context.req.param('id');
  const car = await context.req.json();
  db.cars = db.cars.map((c) =>
    c.id === id ? { ...c, isBooked: car.isBooked } : c
  );
  return context.body(null, 204);
});

serve({ fetch: app.fetch, port: 3001 }, (info) => {
  console.log(`API running on ${info.port}`);
});
