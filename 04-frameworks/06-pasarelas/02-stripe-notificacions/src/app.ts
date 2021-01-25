import { createApp } from './express.server';
import { envConstants } from './env.constants';
import { api } from './api';
import express from 'express';
import path from 'path';
import Stripe from 'stripe';

// https://github.com/stripe/stripe-node#usage-with-typescript
const stripe = new Stripe(envConstants.STRIPE_SECRET, {
  apiVersion: '2020-08-27',
});

const app = createApp();

app.use(express.json()); //Used to parse JSON bodies
app.use('/', express.static(path.join(__dirname, 'static')));

app.use('/api', api);

app.listen(envConstants.PORT, () => {
  console.log(`Server ready at http://localhost:${envConstants.PORT}/api`);
});


