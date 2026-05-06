async function loadProducts() {
  const res = await fetch("/data/products.yml");
  const yamlText = await res.text();
  const data = jsyaml.load(yamlText);

  const grid = document.getElementById("product-grid");

  data.products.forEach((p) => {
    const card = document.createElement("article");
    card.className = "card";

    card.innerHTML = `
      <img src="${p.image}" alt="${p.title}" />
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <div class="price">$${p.price.toFixed(2)}</div>
    `;

    grid.appendChild(card);
  });
}

loadProducts();
