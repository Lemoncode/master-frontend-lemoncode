import { Router } from 'express';
import Stripe from 'stripe'; //require('stripe')('sk_test_51I6CyeIc8xc9b5x9hrN1OdIlGHHnTs94RBiIBsbHSkMAZGU7hP8WwFnO7kRsq3IKQx8SrW5DOs0dTaDzQZWXon8O00g5kpYFnW');
import { envConstants } from './env.constants';

const stripe = new Stripe(envConstants.STRIPE_SECRET, {
  apiVersion: '2020-08-27',
});

export const api = Router();

// Aquí copiamos y pegamos el código que nos dió el comando _stripe listen --forward_ (el que empieza + por whsec_)
const endpointSecret = 'whsec_V6CdafAlYjRjjadzs36IjMSOHGPizXgT';

api.get('/', async (req, res) => {
  res.send({ id: '1', name: 'test data' });
});

// Este va a ser el punto de entrada que buscará stripe
api.post('/webhook', (request, response) => {
  const sig = request.headers['stripe-signature'];
  const payload = request.body;

  // Aquí simplemente mostramos por consola lo que nos devuelve Stripe
  console.log('Got payload: ' + JSON.stringify(payload));

  let event;

  try {
    // Tiramos de la librería de stripe para validar la respuesta usando el endPointSecret
    // esto nos permite ver si el mensaje no viene de un impostor
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err) {
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  response.status(200);
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
