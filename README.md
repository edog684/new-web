# FF.inc – Precision 3D Prints

A modern, dark-themed e-commerce website for FF.inc, specializing in high-precision 3D printed fidgets and daily-use tools. Built as a static site with dynamic product loading from YAML data, featuring a shopping cart, search functionality, and Stripe-powered checkout.

## 🚀 Features

- **Product Catalog**: Dynamic product grid loaded from YAML data
- **Search Functionality**: Real-time search across product titles, descriptions, and categories
- **Shopping Cart**: Add/remove items with quantity tracking and total calculation
- **Product Modal**: Detailed view with image/video carousel and touch/swipe support
- **Responsive Design**: Mobile-friendly layout with glassmorphism navigation
- **Stripe Integration**: Secure payment processing via Stripe Checkout
- **Contact Form**: Customer support form using Formspree
- **Static Deployment**: Optimized for Vercel with serverless API functions

## 🛠 Tech Stack

- **Backend**: Node.js with Express.js
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Data Management**: YAML for product catalog
- **Styling**: Custom CSS with dark theme and glassmorphism effects
- **Payment Processing**: Stripe API
- **Deployment**: Railway (Node.js application)
- **Forms**: Formspree for contact submissions
- **Libraries**: js-yaml for YAML parsing

## 📁 Project Structure

```
├── index.html              # Main page layout
├── styles.css              # Dark theme and responsive styles
├── load-products.js        # Product loading, cart, and UI logic
├── server.js               # Express server for Railway deployment
├── data/
│   └── products.yml        # Product catalog data
├── images/                 # Product images and assets
├── videos/                 # Product demo videos
├── success.html            # Payment success page
├── cancel.html             # Payment cancel page
└── package.json            # Node.js dependencies and scripts
```

## 🏃‍♂️ Local Development

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/edog684/new-web.git
   cd new-web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deployment

### Railway Deployment

1. Connect your GitHub repository to Railway
2. Railway will automatically detect it's a Node.js project
3. Add your Stripe secret key as an environment variable:
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
4. Deploy automatically on push to main branch

### Manual Deployment

The app runs on Express.js and can be deployed to any Node.js hosting platform:

1. Set `STRIPE_SECRET_KEY` environment variable
2. Run `npm start`
3. Ensure images are in the `images/` folder

## 📊 Data Management

Products are stored in `data/products.yml`. Each product entry includes:

```yaml
- id: unique-identifier
  title: "Product Name"
  description: "Product description"
  price: 12.49
  category: "daily-use"
  images:
    - "image-url-1"
    - "image-url-2"
  videos:
    - "video-url-1"
```

### Adding Products

1. Add product images to the `images/` folder
2. Add demo videos to the `videos/` folder (optional)
3. Update `data/products.yml` with new product data using local paths like `/images/product.jpg`
4. Commit and deploy changes

## 💳 Payment Integration

The site uses Stripe Checkout for secure payments:

- Express route in `server.js` handles `/api/checkout`
- Cart data is sent to the API and converted to Stripe line items
- Users are redirected to Stripe's hosted checkout page
- Success/cancel pages handle post-payment flow

### Configuration

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your secret key from the Stripe dashboard
3. Set as environment variable: `STRIPE_SECRET_KEY`
4. Success/cancel URLs are automatically generated based on the deployment domain

## 🎨 Customization

### Styling

- Main styles in `styles.css`
- Dark theme with CSS custom properties
- Glassmorphism effects on navigation
- Responsive breakpoints for mobile/desktop

### Functionality

- Product loading and rendering in `load-products.js`
- Cart management and local storage
- Search filtering logic
- Modal carousel with touch support

## 📞 Support & Contact

- **Customer Support**: Use the contact form on the website
- **Custom Orders**: Email custom@ff.inc
- **Technical Issues**: Create an issue on GitHub

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test locally
4. Commit changes: `git commit -am 'Add feature'`
5. Push to branch: `git push origin feature-name`
6. Submit a pull request

## 📄 License

© 2024 FF.inc — All rights reserved.

## 🔗 Links

- [Live Site](https://your-site.com) (update with your Railway domain)
- [Railway Documentation](https://docs.railway.app)
- [Stripe Documentation](https://stripe.com/docs)
- [Express.js Documentation](https://expressjs.com)
- [Formspree](https://formspree.io)
