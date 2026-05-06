let allProducts = [];
let cart = [];

async function loadProducts() {
  const res = await fetch("/data/products.yml");
  const yamlText = await res.text();
  const data = jsyaml.load(yamlText);
  allProducts = data.products || [];
  renderProducts(allProducts);
  setupSearch();
  setupCartUI();
}

function renderProducts(products) {
  const grid = document.getElementById("product-grid");
  grid.innerHTML = "";

  products.forEach((p) => {
    const card = document.createElement("article");
    card.className = "card";

    card.innerHTML = `
      <img src="${p.image}" alt="${p.title}" />
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <div class="price">$${p.price.toFixed(2)}</div>
      <button class="btn ghost add-to-cart" data-id="${p.id}">Add to cart</button>
    `;

    grid.appendChild(card);
  });

  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      addToCart(id);
    });
  });
}

function setupSearch() {
  const input = document.getElementById("search-input");
  if (!input) return;

  input.addEventListener("input", () => {
    const q = input.value.toLowerCase();
    const filtered = allProducts.filter((p) =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.category && p.category.toLowerCase().includes(q))
    );
    renderProducts(filtered);
  });
}

function setupCartUI() {
  const cartBtn = document.getElementById("cart-btn");
  const cartPanel = document.getElementById("cart-panel");
  const cartClose = document.getElementById("cart-close");
  const checkoutForm = document.getElementById("checkout-form");

  cartBtn.addEventListener("click", () => {
    cartPanel.classList.add("open");
  });

  cartClose.addEventListener("click", () => {
    cartPanel.classList.remove("open");
  });

  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Order placed! (In a real setup, this would trigger payment + shipping logic.)");
    cart = [];
    renderCart();
    e.target.reset();
  });
}

function addToCart(id) {
  const product = allProducts.find((p) => p.id === id);
  if (!product) return;

  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  renderCart();
}

function renderCart() {
  const container = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");

  container.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const row = document.createElement("div");
    row.className = "cart-item-row";
    const lineTotal = item.price * item.qty;
    total += lineTotal;

    row.innerHTML = `
      <span>${item.title} × ${item.qty}</span>
      <span>$${lineTotal.toFixed(2)}</span>
    `;
    container.appendChild(row);
  });

  totalEl.textContent = `$${total.toFixed(2)}`;
}

loadProducts();
