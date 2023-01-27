registerForm = document.getElementById("register-form");

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let email = document.getElementById("email");
  let profile = document.getElementById("profile");
  let password = document.getElementById("password");

  if (email.value == "" || profile.value == "" || password == "") {
    let alert = document.getElementById("alert");
    alert.style.display = "flex";
    setTimeout(() => {
      alert.style.display = "none";
    }, 2000);

    return;
  }
});
