const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const email = req.body;
  if (req.method === 'POST') {
    try {
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: 'price_1LPSDCDvgpZ8FOMotqbyPNMM',
            quantity: 1
          },
        ],
        customer_email: email,
        mode: 'subscription',
        success_url: `${req.headers.origin}/thanks?success=true`,
        cancel_url: `${req.headers.origin}/register?canceled=true`,
      });
      // res.redirect(303, session.url);
      // console.log(session.url, "session api")
      res.send(session);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}