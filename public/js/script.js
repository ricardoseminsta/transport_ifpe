function validateRegister() {
  registerForm = document.getElementById("register-form");

  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let email = document.getElementById("email");
    let profile = document.getElementById("profile");
    let password = document.getElementById("password");

    if (email.value == "" || profile.value == "" || password.value == "") {
      let alert = document.getElementById("alert");
      alert.classList.remove("box--hidden");
      alert.classList.add("transition");
      setTimeout(() => {
        alert.classList.add("box--show");
      }, 1000);
      setTimeout(() => {
        alert.classList.remove("box--show");
        alert.classList.add("box--hidden");
      }, 1800);
    } else {
      let texProfile = "";
      switch (profile.value) {
        case "SP88":
          texProfile = "Servidor";
          break;
        case "PR10":
          texProfile = "Portaria";
          break;
        case "MT18":
          texProfile = "Motorista";
          break;
      }

      confirm(
        `Confirme os dados:\nEmail: ${email.value}\nPerfil: ${texProfile}`
      ) == true
        ? registerForm.submit()
        : window.location.reload();
    }
  });
}

function validateUpdate() {
  updateUserForm = document.getElementById("update-user");

  updateUserForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let email = document.getElementById("nemail");
    let profile = document.getElementById("nprofile");

    if (email.value == "" && profile.value == "") {
      let alert = document.getElementById("alert");
      alert.classList.remove("box--hidden");
      alert.classList.add("transition");
      setTimeout(() => {
        alert.classList.add("box--show");
      }, 1000);
      setTimeout(() => {
        alert.classList.remove("box--show");
        alert.classList.add("box--hidden");
      }, 1800);
    } else {
      let textProfile = "";
      switch (profile.value) {
        case "SP88":
          textProfile = "Servidor";
          break;
        case "PR10":
          textProfile = "Portaria";
          break;
        case "MT18":
          textProfile = "Motorista";
          break;
      }

      confirm(
        `Confirme os dados:\nEmail: ${email.value}\nPerfil: ${textProfile}`
      ) == true
        ? updateUserForm.submit()
        : window.location.reload();
    }
  });
}
