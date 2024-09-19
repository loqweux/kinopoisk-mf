import { app } from "../vars";
import { signOut } from "firebase/auth";
import Kinopoisk from "../services/kinopoisk";
import createPreloader from "./preloader";
import "./movieHome.scss";

export default async function movieHome(auth) {
  app.innerHTML = createPreloader();
  await new Promise((resolve) => setTimeout(resolve, 0));

  app.innerHTML += `
    <nav class="navbar">
      <div class="logo">
        <img src="./assets/Logo.webp" alt="Logo" />
      </div>
      <div class="nav-links" id="nav-links">
        <a href="/home">HOME</a>
        <a href="/movieHome" class="a-mov">MOVIES</a>
      </div>
      <div class="logout">
        <img src="../../assets/power-button.webp" alt="logout" />
      </div>
    </nav>
    <div class="wrapper-junres">
      <p data-genre="Драма">Драма</p>
      <p data-genre="Комедия">Комедия</p>
      <p data-genre="Ужасы">Ужасы</p>
      <p data-genre="Боевик">Боевик</p>
      <p data-genre="Фантастика">Фантастика</p>
      <p data-genre="Приключения">Приключения</p>
    </div>
    <div class="wrapper-films">
      <div id="2019Container" class="movie-list-container"></div>
      <div id="2020Container" class="movie-list-container"></div>
      <div id="2021Container" class="movie-list-container"></div>
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

  const movies2019 = await Kinopoisk.getPremieres(2019, "DECEMBER");
  const movies2020 = await Kinopoisk.getPremieres(2020, "DECEMBER");
  const movies2021 = await Kinopoisk.getPremieres(2021, "DECEMBER");

  const allMovies = [
    ...movies2019.items,
    ...movies2020.items,
    ...movies2021.items,
  ];

  const preloader = document.querySelector(".preloader");
  if (preloader) {
    preloader.remove();
  }

  const genreElements = document.querySelectorAll(".wrapper-junres p");
  let selectedGenre = null;

  genreElements.forEach((genreElement) => {
    genreElement.addEventListener("click", () => {
      const genre = genreElement.getAttribute("data-genre");
      genreElements.forEach((el) => (el.style.textDecoration = "none"));
      if (selectedGenre !== genre) {
        selectedGenre = genre;
        genreElement.style.textDecoration = "underline";
      } else {
        selectedGenre = null;
      }
      filterAndRenderMovies(selectedGenre);
    });
  });

  renderMovies(allMovies);

  function filterAndRenderMovies(genre) {
    let filteredMovies;

    if (genre) {
      filteredMovies = allMovies.filter((movie) => {
        if (movie.genres) {
          for (let i = 0; i < movie.genres.length; i++) {
            if (movie.genres[i].genre.toLowerCase() === genre.toLowerCase()) {
              return true;
            }
          }
        }
        return false;
      });
    } else {
      filteredMovies = allMovies;
    }
    renderMovies(filteredMovies);
  }

  function renderMovies(data) {
    const containers = ["2019Container", "2020Container", "2021Container"];
    const moviesByYear = {
      2019: [],
      2020: [],
      2021: [],
    };

    data.forEach((movie) => {
      if (movie.year === 2019) {
        moviesByYear[2019].push(movie);
      } else if (movie.year === 2020) {
        moviesByYear[2020].push(movie);
      } else if (movie.year === 2021) {
        moviesByYear[2021].push(movie);
      }
    });

    containers.forEach((containerId) => {
      const year = parseInt(containerId);
      const movieListElement = document.getElementById(containerId);
      movieListElement.innerHTML = "";

      const filteredMovies = moviesByYear[year];

      if (filteredMovies.length) {
        const movieContainer = document.createElement("div");
        movieContainer.classList.add("movie-container-movs");

        filteredMovies.forEach((film) => {
          const filmDiv = document.createElement("div");
          filmDiv.classList.add("movie");

          filmDiv.innerHTML = `
            <img loading="lazy" src="${film.posterUrlPreview}" alt="${film.nameRu}">
          `;

          filmDiv.addEventListener("click", () => {
            if (film.kinopoiskId) {
              window.location.pathname = `/movies/${film.kinopoiskId}`;
            } else {
              console.error("Не удалось получить ID фильма:", film);
            }
          });

          movieContainer.append(filmDiv);
        });

        movieListElement.append(movieContainer);
      } else {
        movieListElement.innerHTML = `<p class="error-films-find">Фильмы не найдены</p>`;
      }
    });
  }
}
