const themeToggle = document.querySelector(".theme-toggle");
const modal = document.querySelector("#contact-modal");
const contactButton = document.querySelector(".mail__btn");
const closeButton = document.querySelector(".modal__close");

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
}

let initialTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
  ? "dark"
  : "light";

try {
  const savedTheme = localStorage.getItem("portfolio-theme");
  if (savedTheme === "dark" || savedTheme === "light") initialTheme = savedTheme;
} catch {
  // The toggle still works when browser storage is unavailable.
}

setTheme(initialTheme);

themeToggle.addEventListener("click", () => {
  const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  setTheme(theme);
  try {
    localStorage.setItem("portfolio-theme", theme);
  } catch {
    // Saving a preference is optional.
  }
});

contactButton.addEventListener("click", () => {
  modal.showModal();
  document.body.classList.add("modal-open");
});

closeButton.addEventListener("click", () => modal.close());

modal.addEventListener("close", () => {
  document.body.classList.remove("modal-open");
  contactButton.focus();
});
