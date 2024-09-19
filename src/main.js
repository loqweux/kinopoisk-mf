import firebaseConfig from "./firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import loginPage from "./pages/auth/LoginPage/loginPage";
import moviesPage from "./pages/movies";
import homePage from "./pages/home";
import registerPage from "./pages/auth/RegisterPage/registerPage";
import movieHome from "./pages/movieHome";

initializeApp(firebaseConfig);

const auth = getAuth();

onAuthStateChanged(auth, (user) => {
  validateUser(user);
  const path = window.location.pathname;
  if (path.startsWith("/movies/")) {
    const id = path.split("/").pop();
    moviesPage(id, auth);
  } else {
    switch (path) {
      case "/login":
        loginPage(auth);
        break;
      case "/home":
        homePage(auth);
        break;
      case "/movieHome":
        movieHome(auth);
        break;
      case "/register":
        registerPage(auth);
        break;
      default:
        registerPage(auth);
        break;
    }
  }
});
function validateUser(user) {
  if (
    !user &&
    window.location.pathname !== "/register" &&
    window.location.pathname !== "/login"
  ) {
    window.location.pathname = "/register";
  } else if (
    user &&
    window.location.pathname !== "/home" &&
    window.location.pathname !== "/movieHome" &&
    !window.location.pathname.startsWith("/movies/")
  ) {
    window.location.pathname = "/home";
  }
}
