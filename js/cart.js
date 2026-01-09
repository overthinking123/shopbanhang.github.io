// Thêm vào giỏ hàng
function addToCart(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(id);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("✅ Đã thêm xe vào giỏ hàng");
}

// Load giỏ hàng + tính tổng
function loadCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let html = "";
  let total = 0;

  if (cart.length === 0) {
    document.getElementById("cart-list").innerHTML = "<p>Giỏ hàng đang trống.</p>";
    document.getElementById("total").innerText = "0";
    return;
  }

  cart.forEach((id, index) => {
    const p = products.find(x => x.id === id);
    if (!p) return;

    total += p.price;

    html += `
      <div class="cart-item">
        <span>${index + 1}. ${p.name}</span>
        <strong>${p.price.toLocaleString()}₫</strong>
      </div>
    `;
  });

  document.getElementById("cart-list").innerHTML = html;
  document.getElementById("total").innerText = total.toLocaleString();
}
