import "./preloader.scss";

export default function createPreloader() {
  return `
      <div class="preloader">
        <nav class="preloader-nav"></nav>
        <div class="preloader-popular"></div>
        <div class="preloader-faq"></div>
      </div>
    `;
}
