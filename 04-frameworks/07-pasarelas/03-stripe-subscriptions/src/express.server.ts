import express from 'express';

export const createApp = () => {
  const app = express();

  // https://stackoverflow.com/questions/56816184/stripe-webhook-error-no-signatures-found-matching-the-expected-signature-for-pa/56834675
  app.use(
    express.json({
      verify: function (req, res, buf, enconding) {
        req['raw'] = buf;
      },
    })
  ); //Used to parse JSON bodies

  return app;
};
