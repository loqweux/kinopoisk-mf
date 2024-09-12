const baseUrl = "https://kinopoiskapiunofficial.tech";
const apiKey = "938f91d9-ec95-476f-b0f2-b6a19795152c";

export default class Kinopoisk {
  static async getMoviePopular() {
    try {
      const response = await fetch(
        `${baseUrl}/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1`,
        {
          method: "GET",
          headers: {
            "X-API-KEY": apiKey,
            "Content-Type": "application/json",
          },
        }
      );
      return await response.json();
    } catch (e) {
      console.error("Ошибка при получении данных: ", e);
    }
  }
  static async getMovieById(id) {
    try {
      const response = await fetch(`${baseUrl}/api/v2.2/films/${id}`, {
        method: "GET",
        headers: {
          "X-API-KEY": apiKey,
          "Content-Type": "application/json",
        },
      });
      return await response.json();
    } catch (e) {
      console.error("Ошибка при получении данных о фильме: ", e);
    }
  }
}
