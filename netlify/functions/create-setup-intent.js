const Stripe = require('stripe');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: "Method not allowed" };
  }

  try {
    const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

    const customer = await stripe.customers.create({});
    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
      usage: "off_session"
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        clientSecret: setupIntent.client_secret,
        customerId: customer.id
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
