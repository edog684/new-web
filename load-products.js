let allProducts = [];
let cart = [];
let activeCategory = "all";
let searchQuery = "";

// Load products from YAML
async function loadProducts() {
  try {
    const res = await fetch("/data/products.yml");
    if (!res.ok) {
      throw new Error(`Failed to fetch products.yml (${res.status})`);
    }

    const yamlText = await res.text();
    const data = jsyaml.load(yamlText) || {};
    allProducts = Array.isArray(data.products) ? data.products : [];

    renderCategoryFilters(allProducts);
    renderFilteredProducts();
    setupSearch();
    setupCartUI();
  } catch (error) {
    console.error("Failed to load products:", error);
    const grid = document.getElementById("product-grid");
    if (grid) {
      grid.innerHTML = "<p>Could not load products right now. Please refresh and try again.</p>";
    }
  }
}

function renderProducts(products) {
  const grid = document.getElementById("product-grid");
  grid.innerHTML = "";

  products.forEach((p) => {
    const card = document.createElement("article");
    card.className = "card";

    card.innerHTML = `
      <img src="${(p.images && p.images[0]) || ""}" alt="${p.title}" loading="lazy" />
      <h3>${p.title}</h3>
      <div class="category-pill">${p.category || "uncategorized"}</div>
      <p>${p.description}</p>
      <div class="price">$${Number(p.price || 0).toFixed(2)}</div>

      <button class="btn ghost view-product" data-id="${p.id}">View</button>
      <button class="btn primary add-to-cart" data-id="${p.id}">Add to Cart</button>
    `;

    grid.appendChild(card);
  });

  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      addToCart(id);
    });
  });

  document.querySelectorAll(".view-product").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const product = allProducts.find((p) => p.id === id);
      if (!product) return;
      openProductModal(product);
    });
  });
}

function renderCategoryFilters(products) {
  const container = document.getElementById("category-filters");
  if (!container) return;

  const categories = Array.from(
    new Set(products.map((p) => (p.category || "").trim().toLowerCase()).filter(Boolean))
  ).sort();

  const labels = ["all", ...categories];
  container.innerHTML = "";

  labels.forEach((label) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `category-chip${label === activeCategory ? " active" : ""}`;
    btn.textContent = label.charAt(0).toUpperCase() + label.slice(1);
    btn.addEventListener("click", () => {
      activeCategory = label;
      renderCategoryFilters(allProducts);
      renderFilteredProducts();
    });
    container.appendChild(btn);
  });
}

function renderFilteredProducts() {
  const q = searchQuery.trim().toLowerCase();
  const filtered = allProducts.filter((p) => {
    const category = (p.category || "").toLowerCase();
    const matchesCategory = activeCategory === "all" || category === activeCategory;
    const matchesSearch = !q ||
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      category.includes(q);
    return matchesCategory && matchesSearch;
  });
  renderProducts(filtered);
}

// SEARCH
function setupSearch() {
  const input = document.getElementById("search-input");
  if (!input) return;

  input.addEventListener("input", () => {
    searchQuery = input.value || "";
    renderFilteredProducts();
  });
}

// CART UI
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

  checkoutForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const checkoutItems = cart.map((item) => ({ id: item.id, qty: item.qty }));
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkoutItems)
      });

      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Checkout failed");
      }
      window.location = data.url; // Redirect to Stripe Checkout
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Checkout could not be started. Please try again.");
    }
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
      <span>${item.title} x ${item.qty}</span>
      <span>$${lineTotal.toFixed(2)}</span>
    `;
    container.appendChild(row);
  });

  totalEl.textContent = `$${total.toFixed(2)}`;
}

// MODAL ELEMENTS
const modal = document.getElementById("product-modal");
const modalClose = document.getElementById("modal-close");
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const modalPrice = document.getElementById("modal-price");
const modalAddCart = document.getElementById("modal-add-cart");

const carouselTrack = document.getElementById("carousel-track");
const carouselLeft = document.getElementById("carousel-left");
const carouselRight = document.getElementById("carousel-right");

let currentSlide = 0;
let totalSlides = 0;

// OPEN MODAL
function openProductModal(product) {
  if (!product) return;

  modalTitle.textContent = product.title;
  modalDescription.textContent = product.description;
  modalPrice.textContent = `$${Number(product.price || 0).toFixed(2)}`;

  modalAddCart.onclick = () => addToCart(product.id);

  // Build carousel
  carouselTrack.innerHTML = "";
  currentSlide = 0;

  const media = [...(product.images || []), ...(product.videos || [])];
  totalSlides = media.length;
  carouselLeft.style.display = totalSlides > 1 ? "inline-flex" : "none";
  carouselRight.style.display = totalSlides > 1 ? "inline-flex" : "none";

  if (totalSlides === 0) {
    const fallback = document.createElement("p");
    fallback.textContent = "No media available for this item.";
    carouselTrack.appendChild(fallback);
    modal.style.display = "flex";
    return;
  }

  media.forEach((src) => {
    let element;

    const lowerSrc = String(src).toLowerCase();
    if (lowerSrc.endsWith(".mp4") || lowerSrc.endsWith(".webm")) {
      element = document.createElement("video");
      element.src = src;
      element.controls = true;
    } else {
      element = document.createElement("img");
      element.src = src;
      element.loading = "lazy";
    }

    carouselTrack.appendChild(element);
  });

  updateCarousel();

  modal.style.display = "flex";
}

// CLOSE MODAL
modalClose.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});

// CAROUSEL CONTROLS
carouselLeft.addEventListener("click", () => {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  updateCarousel();
});

carouselRight.addEventListener("click", () => {
  currentSlide = (currentSlide + 1) % totalSlides;
  updateCarousel();
});

// TOUCH SWIPE
let startX = 0;

carouselTrack.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

carouselTrack.addEventListener("touchend", (e) => {
  const endX = e.changedTouches[0].clientX;
  const diff = endX - startX;

  if (diff > 50) {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  } else if (diff < -50) {
    currentSlide = (currentSlide + 1) % totalSlides;
  }

  updateCarousel();
});

// UPDATE CAROUSEL POSITION
function updateCarousel() {
  if (!totalSlides) return;
  carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
}

loadProducts();
