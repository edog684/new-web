import Stripe from "stripe";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const stripe = new Stripe(process.env.sk_test_51TGMV1GpYbufc86Rkdn5nM2lqqf83jDUbmAqZ1f9XuihSwmYanYiavEOez8d52VyowRjmqOAc4duOO9JT3FAgn5000UxNJqfPs);
  const cart = JSON.parse(req.body);

  const line_items = cart.map(item => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.title,
        images: [item.images[0]]
      },
      unit_amount: Math.round(item.price * 100)
    },
    quantity: item.qty
  }));

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items,
    success_url: "https://your-site.com/success",
    cancel_url: "https://your-site.com/cancel"
  });

  res.status(200).json({ url: session.url });
}
