function submitOrder(e) {
  e.preventDefault();

  const order = {
    name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    email: document.getElementById("email").value,
    note: document.getElementById("note").value,
    payment: document.querySelector('input[name="pay"]:checked').value,
    cart: JSON.parse(localStorage.getItem("cart")) || []
  };

  console.log("ĐƠN ĐẶT XE:", order);

  alert("🎉 Đặt xe thành công! Chúng tôi sẽ liên hệ sớm.");

  localStorage.removeItem("cart");
  window.location.href = "index.html";
}
