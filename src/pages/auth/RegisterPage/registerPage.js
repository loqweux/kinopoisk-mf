import "./registerPage.scss";
import { app } from "../../../vars.js";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function registerPage(auth) {
  app.innerHTML = `
    <nav>
      <img src="./assets/Logo.webp" alt="Logo" />
    </nav>
    <div class="title-text">
      <h2>Начните просмотр фильмов прямо сейчас!</h2>
    </div>
    <div class="wrapper-form-register">
      <form name="registerForm">
        <h1>Регистрация</h1>
        <input type="email" name="email" placeholder="Введите адрес эл. почты" />
        <div class="wrapper-error">
          <img class="error-icon none" src="../../../../assets/err.png" alt="err" />
          <span class="err1 none">Неверный формат email</span>
        </div>
        <input type="text" name="firstName" placeholder="Имя" />
        <div class="wrapper-error">
          <img class="error-icon none" src="../../../../assets/err.png" alt="err" />
          <span class="err2 none">Имя не должно быть пустым</span>
        </div>
        <input type="text" name="lastName" placeholder="Фамилия" />
        <div class="wrapper-error">
          <img class="error-icon none" src="../../../../assets/err.png" alt="err" />
          <span class="err3 none">Фамилия не должна быть пустой</span>
        </div>
        <input type="password" name="password" placeholder="Введите пароль" />
        <div class="wrapper-error">
          <img class="error-icon none" src="../../../../assets/err.png" alt="err" />
          <span class="err4 none">Пароль должен быть от 6 до 16 символов</span>
        </div>
        <input type="password" name="confirmPassword" placeholder="Подтвердите пароль" />
        <div class="wrapper-error">
          <img class="error-icon none" src="../../../../assets/err.png" alt="err" />
          <span class="err5 none">Пароли не совпадают</span>
        </div>
        <button type="submit">Создать учетную запись</button>
        <p>Уже есть учетная запись? <a href="/login">Войдите сейчас</a></p>
        <span class="error none"></span>
      </form>
    </div>
  `;
  const formRegister = document.forms.registerForm;
  const error = document.querySelector(".error");
  formRegister.addEventListener("submit", (e) => {
    e.preventDefault();
    error.classList.add("none");
    const emailError = document.querySelector(".err1");
    const firstNameError = document.querySelector(".err2");
    const lastNameError = document.querySelector(".err3");
    const passwordError = document.querySelector(".err4");
    const confirmPasswordError = document.querySelector(".err5");
    const emailIcons = document.querySelectorAll(".wrapper-error .error-icon");
    const emailValue = formRegister.email.value;
    const firstNameValue = formRegister.firstName.value;
    const lastNameValue = formRegister.lastName.value;
    const passwordValue = formRegister.password.value;
    const confirmPasswordValue = formRegister.confirmPassword.value;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const resetErrors = () => {
      emailIcons.forEach((icon) => icon.classList.add("none"));
      emailError.classList.add("none");
      firstNameError.classList.add("none");
      lastNameError.classList.add("none");
      passwordError.classList.add("none");
      confirmPasswordError.classList.add("none");
    };
    resetErrors();
    let hasError = false;
    if (emailValue.match(emailPattern) === null) {
      emailError.classList.remove("none");
      emailIcons[0].classList.remove("none");
      hasError = true;
    }
    if (firstNameValue.length === 0) {
      firstNameError.classList.remove("none");
      emailIcons[1].classList.remove("none");
      hasError = true;
    }
    if (lastNameValue.length === 0) {
      lastNameError.classList.remove("none");
      emailIcons[2].classList.remove("none");
      hasError = true;
    }
    if (passwordValue.length < 6 || passwordValue.length > 16) {
      passwordError.classList.remove("none");
      emailIcons[3].classList.remove("none");
      hasError = true;
    }
    if (passwordValue !== confirmPasswordValue) {
      confirmPasswordError.classList.remove("none");
      emailIcons[4].classList.remove("none");
      hasError = true;
    }
    if (!hasError) {
      createUserWithEmailAndPassword(auth, emailValue, passwordValue)
        .then(() => {})
        .catch(() => {
          error.classList.remove("none");
          error.textContent = "Ошибка при регистрации. Попробуйте снова";
        });
    }
  });
}
