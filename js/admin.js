// admin.js
let html = "";
products.forEach(p => {
  html += `<p>${p.name} - ${p.price.toLocaleString()}₫</p>`;
});
document.getElementById("admin-list").innerHTML = html;
