// DARK MODE
const toggleButton = document.getElementById("darkModeToggle");

toggleButton.onclick = function () {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    toggleButton.innerHTML = '<i class="fa-solid fa-sun"></i>';
  } else {
    toggleButton.innerHTML = '<i class="fa-solid fa-moon"></i>';
  }
};

// HAMBURGER MENU
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");

hamburger.onclick = function () {
  navMenu.classList.toggle("active");
};

const navLinks = document.querySelectorAll(".nav-menu a");

navLinks.forEach(link => {
  link.onclick = function () {
    navMenu.classList.remove("active");
  };
});