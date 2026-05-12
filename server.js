const express = require('express');
const path = require('path');
const fs = require('fs');
const Stripe = require('stripe');
const yaml = require('js-yaml');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));

function loadProductCatalog() {
  const productPath = path.join(__dirname, 'data', 'products.yml');
  const raw = fs.readFileSync(productPath, 'utf8');
  const parsed = yaml.load(raw) || {};
  const products = Array.isArray(parsed.products) ? parsed.products : [];
  return new Map(products.map((p) => [String(p.id), p]));
}

function toAbsoluteUrl(req, mediaPath) {
  if (!mediaPath) return null;
  if (/^https?:\/\//i.test(mediaPath)) return mediaPath;
  if (String(mediaPath).startsWith('/')) {
    return `${req.protocol}://${req.get('host')}${mediaPath}`;
  }
  return `${req.protocol}://${req.get('host')}/${mediaPath}`;
}

// API Routes
app.post('/api/checkout', async (req, res) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: 'Stripe key not configured' });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const cart = Array.isArray(req.body) ? req.body : [];
    if (!cart.length) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const catalog = loadProductCatalog();

    const line_items = cart.map((item) => {
      const id = String(item.id || '');
      const qty = Number(item.qty);
      const product = catalog.get(id);

      if (!product) {
        throw new Error(`Unknown product id: ${id}`);
      }
      if (!Number.isInteger(qty) || qty < 1 || qty > 50) {
        throw new Error(`Invalid quantity for product id: ${id}`);
      }
      const unitAmount = Math.round(Number(product.price) * 100);
      if (!Number.isFinite(unitAmount) || unitAmount < 1) {
        throw new Error(`Invalid price for product id: ${id}`);
      }

      const imagePath = Array.isArray(product.images) ? product.images[0] : null;
      const absoluteImage = toAbsoluteUrl(req, imagePath);
      const productData = { name: product.title };
      if (absoluteImage) {
        productData.images = [absoluteImage];
      }

      return {
        price_data: {
          currency: 'usd',
          product_data: productData,
          unit_amount: unitAmount
        },
        quantity: qty
      };
    });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: `${req.protocol}://${req.get('host')}/success.html`,
      cancel_url: `${req.protocol}://${req.get('host')}/cancel.html`
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve index.html for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
