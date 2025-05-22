import { Router } from 'express';
import Stripe from 'stripe';
import { envConstants } from './env.constants';

// https://github.com/stripe/stripe-node#usage-with-typescript
const stripe = new Stripe(envConstants.STRIPE_SECRET, {
  apiVersion: null,
});

const endpointSecret = 'whsec_...';

export const api = Router();

api.get('/', async (req, res) => {
  res.send({ id: '1', name: 'test data' });
});

api.post('/create-checkout-session/:plan', async (req, res) => {
  const plan = req.params.plan;
  const price = plan === 'basic' ?  'price_1QrG0zIc8xc9b5x9bQ5bQA4T' : 'price_1QrFyBIc8xc9b5x9a1qNcrey';
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `http://localhost:${envConstants.PORT}/success.html`,
    cancel_url: `http://localhost:${envConstants.PORT}/cancel.html`,
  });

  res.redirect(303, session.url);
});

api.post('/customer-portal', async (req, res) => {
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: 'cus_SATRBiexHebQQO', // Hardcoded, it should come from database
    return_url: `http://localhost:${envConstants.PORT}/portal.html`,
  });

  res.redirect(303, portalSession.url);
});

// Este va a ser el punto de entrada que buscará stripe
api.post('/webhook', async (request, response) => {
  const sig = request.headers['stripe-signature'];
  const payload = request.body;
  const rawBody = request['raw'];

  // Aquí simplemente mostramos por consola lo que nos devuelve Stripe
  console.log('Got payload: ' + JSON.stringify(payload));

  try {
    // Tiramos de la librería de stripe para validar la respuesta usando el endPointSecret
    // esto nos permite ver si el mensaje no viene de un impostor
    const event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err) {
    console.log(`*** Web Hook validation failed: ${err.message}`);
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  response.status(200).end();
});
