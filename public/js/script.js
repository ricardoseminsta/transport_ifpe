function validateRegister() {
  let registerForm = document.getElementById("register-form");

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
      let textProfile = "";
      switch (profile.value) {
        case "2001":
          textProfile = "Gestor";
          break;
        case "2002":
          textProfile = "Servidor";
          break;
        case "3001":
          textProfile = "Portaria";
          break;
        case "4001":
          textProfile = "Motorista";
          break;
        default:
          textProfile = "Secret";
          break;
      }

      confirm(
        `Confirme os dados:\nEmail: ${email.value}\nPerfil: ${textProfile}`
      ) == true
        ? registerForm.submit()
        : window.location.reload();
    }
  });
}

function validateUpdate() {
  let updateUserForm = document.getElementById("update-user");

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
        case "2001":
          textProfile = "Gestor";
          break;
        case "2002":
          textProfile = "Servidor";
          break;
        case "3001":
          textProfile = "Portaria";
          break;
        case "4001":
          textProfile = "Motorista";
          break;
        default:
          textProfile = "Secret";
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
function deleteUserForm() {
  let deleteUser = document.getElementById("delete-user");
  deleteUser.addEventListener("submit", (e) => {
    e.preventDefault();
    confirm("Deletar Usuário?") == true
      ? deleteUser.submit()
      : window.location.reload();
  });
}
