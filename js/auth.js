function login() {
  const user = document.getElementById("user").value;
  const pass = document.getElementById("pass").value;

  if (user === "admin" && pass === "123456") {
    localStorage.setItem("role", "admin");
    location.href = "admin.html";
  } else {
    alert("Sai tài khoản");
  }
}
