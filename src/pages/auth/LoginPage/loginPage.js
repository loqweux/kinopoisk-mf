import "./loginPage.scss";
import { app } from "../../../vars";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function loginPage(auth) {
  app.innerHTML = `
  <div class="sign-in">
        <nav>
      <img src="./assets/Logo.webp" alt="Logo" />
    </nav>
    <div class="wrapper-form">
      <form name="loginForm">
        <h1>Войти</h1>
        <input
          type="email"
          name="email"
          placeholder="Введите адрес эл. почты"
        />
        <div class="wrapper-error">
          <img class="error-icon none" src="../../../../assets/err.png" alt="err" />
          <span class="err1 none">Неверный формат email</span>
        </div>
        <input
          type="password"
          name="password"
          placeholder="Введите пароль"
        />
        <div class="wrapper-error">
          <img class="error-icon none" src="../../../../assets/err.png" alt="err" />
          <span class="err2 none">Пароль должен быть от 6 до 16 символов</span>
        </div>
        <button type="submit">Войти</button>
        <p>Впервые на Netflix? <a href="/register">Зарегистрируйтесь сейчас</a></p>
        <span class="error none"></span>
      </form>
    </div>
  </div>
  `;

  const formLogin = document.forms.loginForm;
  const error = document.querySelector(".error");
  const emailError = document.querySelector(".err1");
  const passwordError = document.querySelector(".err2");
  const emailErrorIcon = document.querySelector(
    ".wrapper-error img.error-icon"
  );
  const passwordErrorIcon = document.querySelectorAll(
    ".wrapper-error img.error-icon"
  )[1];

  formLogin.addEventListener("submit", (e) => {
    e.preventDefault();
    error.classList.add("none");
    emailError.classList.add("none");
    passwordError.classList.add("none");
    emailErrorIcon.classList.add("none");
    passwordErrorIcon.classList.add("none");

    const emailValue = formLogin.email.value;
    const passwordValue = formLogin.password.value;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let hasError = false;

    if (emailValue.match(emailPattern) === null) {
      emailError.classList.remove("none");
      emailErrorIcon.classList.remove("none");
      hasError = true;
    }

    if (passwordValue.length < 6 || passwordValue.length > 16) {
      passwordError.classList.remove("none");
      passwordErrorIcon.classList.remove("none");
      hasError = true;
    }

    if (!hasError) {
      signInWithEmailAndPassword(auth, emailValue, passwordValue)
        .then(() => {
          window.location.pathname = "/home";
        })
        .catch(() => {
          error.classList.remove("none");
          error.innerHTML = "Неверные данные";
        });
    }
  });
}
