import { Router } from 'express';
import Stripe from 'stripe';
import { envConstants } from './env.constants';

// https://github.com/stripe/stripe-node#usage-with-typescript
const stripe = new Stripe(envConstants.STRIPE_SECRET, {
  apiVersion: '2020-08-27',
});

export const api = Router();

api.get('/', async (req, res) => {
  res.send({ id: '1', name: 'test data' });
});

api.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Stubborn Attachments',
            images: ['https://i.imgur.com/EHyR2nP.png'],
          },
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `http://localhost:${envConstants.PORT}/success.html`,
    cancel_url: `http://localhost:${envConstants.PORT}/cancel.html`,
  });

  console.log("Session id:", session.id);
  console.log("Session URL:", session.url);
  res.redirect(303, session.url);
});
