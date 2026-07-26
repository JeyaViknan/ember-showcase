"use strict";

// Paste the two YouTube URLs or IDs here when they are available.
// Example: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
const VIDEOS = {
  demo: "",
  hardware: "https://youtu.be/2G8bk6b01eI"
};

function youtubeId(value) {
  if (!value) return "";
  const trimmed = value.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  try {
    const url = new URL(trimmed);
    if (url.hostname.includes("youtu.be")) return url.pathname.replace("/", "").slice(0, 11);
    if (url.searchParams.has("v")) return url.searchParams.get("v").slice(0, 11);
    const match = url.pathname.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : "";
  } catch {
    return "";
  }
}

function renderVideos() {
  document.querySelectorAll(".youtube-slot").forEach((slot) => {
    const id = youtubeId(VIDEOS[slot.dataset.video]);
    if (!id) return;
    slot.innerHTML = "";
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${id}`;
    iframe.title = slot.dataset.video === "demo"
      ? "Hackathon Demonstration"
      : "Existing Hardware Prototype";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    slot.appendChild(iframe);
  });
}

function setTheme(theme) {
  const next = theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = next;
  localStorage.setItem("ember-theme", next);

  const toggle = document.querySelector(".theme-toggle");
  if (!toggle) return;
  const isDark = next === "dark";
  toggle.setAttribute("aria-pressed", String(isDark));
  toggle.setAttribute("aria-label", isDark ? "Switch to day mode" : "Switch to night mode");
  toggle.querySelector("em").textContent = isDark ? "Night" : "Day";
}

function initTheme() {
  const saved = localStorage.getItem("ember-theme");
  const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  setTheme(saved || preferred);

  document.querySelector(".theme-toggle")?.addEventListener("click", () => {
    setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  renderVideos();
});
