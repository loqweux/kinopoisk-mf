import { app } from "../vars";
import { signOut } from "firebase/auth";
import Kinopoisk from "../services/kinopoisk";
import createPreloader from "./preloader";
import "./movies.scss";

export default async function moviesPage(id, auth) {
  app.innerHTML = createPreloader();
  await new Promise((resolve) => setTimeout(resolve, 0));

  const movie = await Kinopoisk.getMovieById(id);

  let countries = "Информация отсутствует";
  if (movie.countries) {
    countries = movie.countries.map((country) => country.country).join(", ");
  }

  let genres = "Информация отсутствует";
  if (movie.genres) {
    genres = movie.genres.map((genre) => genre.genre).join(", ");
  }

  let description = "Описание отсутствует";
  if (movie.description) {
    description = movie.description;
  }

  let ratingValue = "Рейтинг отсутствует";
  if (movie.rating) {
    ratingValue =
      movie.rating + " (Всего голосов: " + (movie.ratingVoteCount || 0) + ")";
  }

  function formatFilmLength(length) {
    if (!length) return "Не указано";
    if (typeof length === "number") {
      const hours = Math.floor(length / 60);
      const minutes = length % 60;
      return `${hours} ч ${minutes} мин`;
    }
    return "Не указано";
  }

  const formattedLength = formatFilmLength(movie.filmLength);

  const preloader = document.querySelector(".preloader");
  if (preloader) {
    preloader.remove();
  }

  app.innerHTML = `
  <div class="container">
    <nav class="navbar">
      <div class="logo">
        <img src="../../assets/Logo.webp" alt="Logo" />
      </div>
      <div class="nav-links" id="nav-links">
        <a href="/home">HOME</a>
        <a href="/movieHome" class="a-mov">MOVIES</a>
      </div>
      <div class="logout">
        <img src="../../assets/power-button.webp" alt="logout" />
      </div>
    </nav>
    <div class="movie-details">
      <img src="${movie.posterUrl}" alt="${
    movie.nameEn || "Постер отсутствует"
  }" class="movie-poster" />
      <div class="movie-info">
        <div class="info-1">
          <div class="wrapper-info-1">
            <h1>${movie.nameRu || "Название отсутствует"}</h1>
            <p>${ratingValue}</p>
          </div>
          <p>${description}</p>
        </div>
        <div class="info-2">
          <h2>О фильме</h2>
          <div class="wrap-info-2">
            <p>Год</p>
            <span>${movie.year || "Не указано"}</span>
          </div>
          <div class="wrap-info-2">
            <p>Длительность</p>
            <span>${formattedLength}</span>
          </div>
          <div class="wrap-info-2">
            <p>Страны</p>
            <span>${countries}</span>
          </div>
          <div class="wrap-info-2">
            <p>Жанры</p>
            <span>${genres}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  `;

  const logoutImg = document.querySelector(".logout img");
  if (logoutImg) {
    logoutImg.addEventListener("click", async () => {
      try {
        await signOut(auth);
        window.location.pathname = "/login";
      } catch (error) {
        console.error("Ошибка при выходе: ", error);
      }
    });
  }
}
