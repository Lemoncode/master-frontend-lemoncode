import { Router } from 'express';
import Stripe from 'stripe';
import { envConstants } from './env.constants';

// https://github.com/stripe/stripe-node#usage-with-typescript
const stripe = new Stripe(envConstants.STRIPE_SECRET, {
  apiVersion: '2020-08-27',
});
const endpointSecret =
  'whsec_23168133d52e1c4583202e1654855f9ac7ac6d28e8828de251e07a9937890fe9';

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

  res.json({ id: session.id });
});

// Este va a ser el punto de entrada que buscará stripe
api.post('/webhook', async (request, response) => {
  const sig = request.headers['stripe-signature'];
  const payload = request.body;
  const rawBody = request['raw'];

  // Aquí simplemente mostramos por consola lo que nos devuelve Stripe
  //console.log('Got payload: ' + JSON.stringify(payload));

  let event;

  try {
    // Tiramos de la librería de stripe para validar la respuesta usando el endPointSecret
    // esto nos permite ver si el mensaje no viene de un impostor
    //const stripeEvent = await stripe.events.retrieve(payload.id);
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err) {
    console.log(`*** Web Hook validation failed: ${err.message}`);
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  response.status(200);
});
