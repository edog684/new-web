# FF.inc - Precision 3D Prints

A dark-themed storefront for FF.inc, a small catalog of precision 3D printed fidgets, accessories, desk items, and daily-use tools. The site is served by Express, loads product data from a YAML file in the browser, and sends cart contents to a Stripe Checkout session.

## Features

- Product catalog loaded from `data/products.yml`
- Real-time search across product titles, descriptions, and categories
- Shopping cart with quantity tracking and total calculation
- Product detail modal with image/video carousel and touch swipe support
- Stripe Checkout session creation through an Express API route
- Contact form powered by Formspree
- Responsive dark UI with local image assets

## Tech Stack

- Node.js and Express for serving the site and checkout API
- HTML, CSS, and vanilla JavaScript for the frontend
- YAML product catalog parsed in the browser with `js-yaml` from a CDN
- Stripe Checkout for payment redirects
- Formspree for support form submissions

## Project Structure

```text
.
|-- index.html          # Main storefront page
|-- styles.css          # Site styling and responsive layout
|-- load-products.js    # Product loading, search, cart, modal, and checkout UI
|-- server.js           # Express static server and /api/checkout route
|-- package.json        # Node scripts and production dependencies
|-- data/
|   `-- products.yml    # Product catalog
|-- images/             # Logo and product images
|-- videos/             # Optional product demo videos
|-- success.html        # Stripe success redirect page
`-- cancel.html         # Stripe cancel redirect page
```

## Local Development

### Prerequisites

- Node.js 18 or newer recommended
- npm
- Stripe secret key for testing checkout

### Setup

```bash
npm install
```

Set your Stripe secret key before testing checkout:

```bash
# macOS/Linux
export STRIPE_SECRET_KEY=sk_test_your_key_here

# Windows PowerShell
$env:STRIPE_SECRET_KEY="sk_test_your_key_here"
```

Start the server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

| Name | Required | Purpose |
| --- | --- | --- |
| `STRIPE_SECRET_KEY` | Yes for checkout | Used by `server.js` to create Stripe Checkout sessions. |
| `PORT` | No | Server port. Defaults to `3000`. |

## Product Data

Products live in `data/products.yml` under a top-level `products` array:

```yaml
products:
  - id: item-1
    title: "Pocket Torque Spinner"
    description: "A compact precision spinner..."
    price: 12.49
    category: "fidget"
    images:
      - "/images/_MG_4712.JPG"
    videos: []
```

To add or update products:

1. Add product images to `images/`.
2. Add optional demo videos to `videos/`.
3. Update `data/products.yml`.
4. Use site-root paths such as `/images/product.jpg` or `/videos/demo.mp4`.
5. Restart the server if your host does not automatically reload static files.

## Checkout Flow

The frontend posts the cart to `POST /api/checkout`. The Express route converts each cart item into a Stripe line item, creates a hosted Checkout session, and returns the Stripe redirect URL.

Current checkout behavior:

- Payments are handled by Stripe Checkout.
- The cart is stored only in browser memory and resets on page refresh.
- The shipping/address form is currently frontend-only; `load-products.js` posts the cart contents, not the entered address fields.
- There is no Stripe webhook handler in this repo, so fulfillment and order confirmation need an external/manual process or a future webhook implementation.

## Deployment

This app is a standard Node.js service and can be deployed to Railway or another Node-capable host.

Deployment checklist:

1. Install dependencies with `npm install` or `npm ci`.
2. Set `STRIPE_SECRET_KEY` in the host environment.
3. Run `npm start`.
4. Ensure the deployment serves the repository root so `/images`, `/data/products.yml`, `/styles.css`, and `/load-products.js` are reachable.
5. Configure your Stripe account and fulfillment process before accepting real orders.

## Useful Commands

```bash
npm run dev      # Start local server
npm start        # Start production server
node --check server.js
node --check load-products.js
npm audit --omit=dev
```

## Known Gaps

- No automated tests are included yet.
- Cart items can be tampered with client-side before checkout; prices should be validated server-side before taking real payments.
- Checkout does not currently persist orders or collect submitted shipping fields.

## License

Copyright 2024 FF.inc. All rights reserved.
