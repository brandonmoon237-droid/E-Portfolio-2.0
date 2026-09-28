const themeToggle = document.querySelector(".theme-toggle");
const modal = document.querySelector("#contact-modal");
const contactButton = document.querySelector(".mail__btn");
const closeButton = document.querySelector(".modal__exit");
const contactForm = document.querySelector("#contact__form");

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

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const fields = new FormData(contactForm);
  const name = fields.get("user_name").trim();
  const email = fields.get("user_email").trim();
  const message = fields.get("message").trim();
  const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
  const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);
  window.location.href = `mailto:brandonmoon237@gmail.com?subject=${subject}&body=${body}`;
});
