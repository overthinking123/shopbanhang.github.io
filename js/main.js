// Demo data (sau này bạn đổi thành API)
const products = [
  {
    id: 1,
    name: "VinFast VF 3",
    price: "287,000,000₫",
    image: "images/vf3.jpg",
    description: "Xe điện mini đô thị..."
  },
  {
    id: 2,
    name: "VinFast VF 6",
    price: "689,000,000₫",
    image: "images/vf6.jpg",
    description: "SUV điện hiện đại..."
  }
];

// Hiển thị nổi bật
function showFeatured() {
  let html = "";
  products.forEach(p => {
    html += `
      <div class="product-card">
        <img src="${p.image}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p class="price">${p.price}</p>
        <a href="product-detail.html?id=${p.id}" class="btn">Xem Chi Tiết</a>
      </div>
    `;
  });
  document.getElementById("featured-list").innerHTML = html;
}

function showProductList() {
  let html = "";
  products.forEach(p => {
    html += `
      <div class="product-card">
        <img src="${p.image}">
        <h3>${p.name}</h3>
        <p class="price">${p.price}</p>
        <a href="product-detail.html?id=${p.id}" class="btn">Chi Tiết</a>
      </div>
    `;
  });
  document.getElementById("product-list").innerHTML = html;
}

function showCarDetail() {
  const params = new URLSearchParams(location.search);
  const id = parseInt(params.get("id"));
  const car = products.find(p => p.id === id);

  if (car) {
    document.getElementById("car-detail").innerHTML = `
      <img src="${car.image}" alt="${car.name}">
      <h2>${car.name}</h2>
      <p class="price">${car.price}</p>
      <p>${car.description}</p>
    `;
  }
}

// Run functions based on page
if (document.getElementById("featured-list")) showFeatured();
if (document.getElementById("product-list")) showProductList();
if (document.getElementById("car-detail")) showCarDetail();
