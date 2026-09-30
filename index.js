const emailConfig = {
  serviceId: "service_ye051ob",
  templateId: "template_tcfqa5g",
  publicKey: "GcGTO5HPnbIzqcy-m",
};

const themeToggle = document.querySelector(".theme-toggle");

const scaleFactor = 1 / 20;

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
}

let savedTheme;
try {
  savedTheme = localStorage.getItem("theme");
} catch {
}
applyTheme(savedTheme === "dark" ? "dark" : "light");

themeToggle.addEventListener("click", () => {
  const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(theme);
  try {
    localStorage.setItem("theme", theme);
  } catch {
  }
});

const contactModal = document.querySelector("#contact-modal");
const contactForm = document.querySelector("#contact__form");
const submitButton = document.querySelector("#contact__submit");
const contactStatus = document.querySelector("#contact-status");
const loadingOverlay = document.querySelector(".modal__overlay--loading");
const successOverlay = document.querySelector(".modal__overlay--success");
let isSending = false;
let isClosing = false;

async function closeContactModal() {
  if (!contactModal.open || isClosing) return;
  isClosing = true;

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const animations = [...contactModal.querySelectorAll(".modal__half")].map((half) => {
      const style = getComputedStyle(half);
      const start = { transform: style.transform, opacity: style.opacity };
      const direction = half.classList.contains("modal__about") ? "-110%" : "110%";

      return half.animate([
        start,
        { transform: `translateX(${direction})`, opacity: 0 },
      ], {
        duration: 550,
        easing: "cubic-bezier(0.64, 0, 0.78, 0)",
        fill: "forwards",
      });
    });

    await Promise.allSettled(animations.map((animation) => animation.finished));
    contactModal.close();
    animations.forEach((animation) => animation.cancel());
  } else {
    contactModal.close();
  }
}

function toggleContactModal() {
  if (contactModal.open) {
    closeContactModal();
    return;
  }

  if (!isSending) {
    successOverlay.hidden = true;
    contactStatus.textContent = "";
  }
  contactModal.showModal();
  contactModal.scrollTop = 0;
  document.body.classList.add("modal-open");
}

document.querySelectorAll("[data-contact-modal]").forEach((trigger) => {
  trigger.addEventListener("click", toggleContactModal);
});

// The native backdrop receives clicks over the page while the dialog is open.
// Dismiss outside clicks while the rest of the page is hidden.
function isOutsideModal(event) {
  const bounds = contactModal.getBoundingClientRect();
  return event.clientX < bounds.left || event.clientX > bounds.right ||
    event.clientY < bounds.top || event.clientY > bounds.bottom;
}

let pointerStartedOutside = false;
contactModal.addEventListener("pointerdown", (event) => {
  pointerStartedOutside = event.target === contactModal && isOutsideModal(event);
});

contactModal.addEventListener("click", (event) => {
  if (pointerStartedOutside && event.target === contactModal && isOutsideModal(event)) {
    closeContactModal();
  }
  pointerStartedOutside = false;
});

document.querySelector(".modal__exit").addEventListener("click", () => {
  closeContactModal();
});

contactModal.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeContactModal();
});

contactModal.addEventListener("close", () => {
  isClosing = false;
  document.body.classList.remove("modal-open");
});

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (isSending || !contactForm.reportValidity()) return;

  isSending = true;
  submitButton.disabled = true;
  contactForm.setAttribute("aria-busy", "true");
  loadingOverlay.hidden = false;
  successOverlay.hidden = true;
  contactStatus.textContent = "Sending your message…";

  try {
    if (!window.emailjs) throw new Error("Email service unavailable");
    await window.emailjs.sendForm(emailConfig.serviceId, emailConfig.templateId, contactForm, {
      publicKey: emailConfig.publicKey,
    });
    contactForm.reset();
    successOverlay.hidden = false;
    contactStatus.textContent = "Thanks for the message! Looking forward to speaking to you soon.";
  } catch {
    contactStatus.textContent = "Your message could not be sent. Please try again in a moment.";
  } finally {
    loadingOverlay.hidden = true;
    contactForm.setAttribute("aria-busy", "false");
    submitButton.disabled = false;
    isSending = false;
  }
});

function moveBackground(event) {
  if (contactModal.open || window.matchMedia("(max-width: 768px), (prefers-reduced-motion: reduce)").matches) return;
  const shapes = document.querySelectorAll(".shape");
  const x = event.clientX * scaleFactor;
  const y = event.clientY * scaleFactor;

  for (let i = 0; i < shapes.length; ++i) {
    const isOdd = i % 2 !== 0;
    const boolInt = isOdd ? -1 : 1;
    shapes[i].style.transform = `translate(${x * boolInt}px, ${y * boolInt}px)`;
  }
}
