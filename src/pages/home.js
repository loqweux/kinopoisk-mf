import { app } from "../vars";
import { signOut } from "firebase/auth";
import Kinopoisk from "../services/kinopoisk";
import createPreloader from "./preloader";
import "./home.scss";

let popularMovies = [];

export default async function homePage(auth) {
  app.innerHTML = createPreloader();
  popularMovies = await Kinopoisk.getMoviePopular();
  const preloader = document.querySelector(".preloader");
  if (preloader) {
    preloader.remove();
  }

  const content = `
    <nav class="navbar">
      <div class="logo">
        <img src="./assets/Logo.webp" alt="Logo" />
      </div>
      <div class="nav-links" id="nav-links">
        <a href="/home" class="a-home">HOME</a>
        <a href="/movieHome">MOVIES</a>
      </div>
      <div class="logout">
        <img src="../../assets/power-button.webp" alt="logout" />
      </div>
    </nav>
    <div class="input-container"></div>
    <div class="movie-container">
      <div class="flex-movie-container">
          <h5>Ещё смотрят</h5>
          <input type="text" id="searchInput" placeholder="Поиск..." />
      </div>
      <div class="scroll-container">
        <button id="left" class="nav-button" style="display: none;">◀</button>
        <div id="movieContainer" class="movie-list"></div>
        <button id="right" class="nav-button">▶</button>
      </div>
    </div>
    <div class="info">
      <h6>Распространенные вопросы</h6>
      <ul id="faqList">
        <li>
          <button class="faq-button">Что из себя представляет Netflix? <img src="../../assets/add.webp" alt="plus"></button>
          <div class="faq-text" style="display: none; opacity: 0;">Netflix — это стриминговый сервис, позволяющий смотреть разнообразные удостоенные наград фильмы, 
          сериалы, аниме, документальные фильмы и многое другое на тысячах устройств с подключением к интернету.<br>
          Вы можете смотреть сколько угодно и когда угодно без рекламы. Вы всегда сможете найти что-нибудь новое!</div>
        </li>
        <li>
          <button class="faq-button">Где смотреть? <img src="../../assets/add.webp" alt="plus"></button>
          <div class="faq-text" style="display: none; opacity: 0;">Смотрите где угодно, когда угодно. Войдите в свой аккаунт Netflix и смотрите через интернет 
          на персональном компьютере или любом устройстве с подключением к интернету, включая телевизоры Smart TV, смартфоны, планшеты, плееры.
          Возьмите с собой Netflix куда угодно.</div>
        </li>
        <li>
          <button class="faq-button">Что можно посмотреть на Netflix? <img src="../../assets/add.webp" alt="plus"></button>
          <div class="faq-text" style="display: none; opacity: 0;">Netflix предлагает огромную библиотеку полнометражных фильмов, документальных фильмов, 
          сериалов, аниме, удостоенного наград оригинального контента Netflix и многое другое. Смотрите сколько угодно и когда угодно.</div>
        </li>
        <li>
          <button class="faq-button">Как зарегистрироваться? <img src="../../assets/add.webp" alt="plus"></button>
          <div class="faq-text" style="display: none; opacity: 0;">Для регистрации на Netflix следуйте инструкциям на экране.</div>
        </li>
        <li>
          <button class="faq-button">О нас <img src="../../assets/add.webp" alt="plus"></button>
          <div class="faq-text" style="display: none; opacity: 0;">Мы - это стриминговый сервис, который предлагает вам широкий выбор фильмов и сериалов. 
          Наша цель - предоставить вам лучший контент и незабываемые впечатления от просмотра.</div>
        </li>
      </ul>
    </div>
  `;

  app.insertAdjacentHTML("beforeend", content);
  renderMovies(popularMovies);

  const logoutImg = document.querySelector(".logout img");
  logoutImg.addEventListener("click", () => {
    signOut(auth)
      .then(() => {
        window.location.pathname = "/login";
      })
      .catch((error) => {
        console.error("Ошибка при выходе: ", error);
      });
  });

  const leftBtn = document.getElementById("left");
  const rightBtn = document.getElementById("right");
  const searchInput = document.getElementById("searchInput");

  leftBtn.addEventListener("click", () => scroll(-200));
  rightBtn.addEventListener("click", () => scroll(200));
  
  searchInput.addEventListener("input", (event) => {
    const query = event.target.value;
    if (query) {
      const filteredMovies = popularMovies.films.filter(
        (movie) =>
          movie.nameRu &&
          movie.nameRu.toLowerCase().includes(query.toLowerCase())
      );
      renderMovies({ films: filteredMovies });
    } else {
      renderMovies(popularMovies);
    }
  });
  const movieListElement = document.getElementById("movieContainer");
  movieListElement.addEventListener("scroll", () => {
    leftBtn.style.display = movieListElement.scrollLeft > 0 ? "block" : "none";
    const maxScrollLeft =
      movieListElement.scrollWidth - movieListElement.clientWidth;
    rightBtn.style.display =
      movieListElement.scrollLeft < maxScrollLeft ? "block" : "none";
    updateFadedImages();
  });
  function updateFadedImages() {
    const movieItems = document.querySelectorAll(".movie-item img");
    movieItems.forEach((img) => {
      img.classList.remove("faded");
    });
    movieItems.forEach((img) => {
      const imgRect = img.getBoundingClientRect();
      const containerRect = movieListElement.getBoundingClientRect();
      if (
        imgRect.left < containerRect.left ||
        imgRect.right > containerRect.right
      ) {
        img.classList.add("faded");
      }
    });
  }
  const faqButtons = document.querySelectorAll(".faq-button");
  faqButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const text = button.nextElementSibling;
      const isVisible = text.style.display === "block";

      if (isVisible) {
        button.style.backgroundColor = "rgb(45, 45, 45)";
        text.style.transition = "opacity 0.5s ease";
        text.style.opacity = "0";
        setTimeout(() => {
          text.style.display = "none";
        }, 500);
      } else {
        button.style.backgroundColor = "rgb(60, 60, 60)";
        text.style.display = "block";
        text.style.transition = "opacity 0.5s ease";
        setTimeout(() => {
          text.style.opacity = "1";
        }, 100);
      }
    });
  });
}
function renderMovies(data) {
  const movieListElement = document.getElementById("movieContainer");
  movieListElement.innerHTML = "";
  if (data && data.films && data.films.length > 0) {
    data.films.forEach((movie) => {
      const movieItem = document.createElement("div");
      movieItem.classList.add("movie-item");
      movieItem.innerHTML = `
        <img src="${movie.posterUrlPreview}" alt="${movie.nameRu}" class="movie-poster" />
      `;
      movieItem.addEventListener("click", () => {
        window.location.pathname = `/movies/${movie.filmId}`;
      });
      movieListElement.append(movieItem);
    });
  } else {
    movieListElement.innerHTML = `<p class="error-films-find">Фильмы не найдены</p>`;
  }
}
function scroll(val) {
  const movieListElement = document.getElementById("movieContainer");
  movieListElement.scrollBy({
    left: val,
    behavior: "smooth",
  });
}