// 1. IMPORT (Wajib di paling atas karena type="module")
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// 2. CONFIGURATION
const firebaseConfig = {
  apiKey: "AIzaSyA1...", // Ganti dengan milikmu
  authDomain: "kogniscio-app.firebaseapp.com",
  projectId: "kogniscio-app",
  storageBucket: "kogniscio-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456:web:abcde12345"
};

// 3. INITIALIZE
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 4. ELEMENT SELECTORS
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const loginBox = document.getElementById('loginBox');
const registerBox = document.getElementById('registerBox');
const toRegister = document.getElementById('toRegister');
const toLogin = document.getElementById('toLogin');
const togglePassword = document.querySelector(".toggle-password");
const passwordInput = document.getElementById("password");

// --- LOGIKA PERPINDAHAN FORM (SHOW/HIDE) ---
if (toRegister && loginBox && registerBox) {
  toRegister.onclick = (e) => {
    e.preventDefault();
    loginBox.style.display = 'none';
    registerBox.style.display = 'block';
  };
}

if (toLogin && loginBox && registerBox) {
  toLogin.onclick = (e) => {
    e.preventDefault();
    registerBox.style.display = 'none';
    loginBox.style.display = 'block';
  };
}

// --- LOGIKA FIREBASE: DAFTAR AKUN ---
if (registerForm) {
  registerForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        alert("Akun sukses dibuat! Silakan login.");
        registerBox.style.display = 'none';
        loginBox.style.display = 'block';
      })
      .catch((error) => alert("Gagal mendaftar: " + error.message));
  });
}

// --- LOGIKA FIREBASE: LOGIN ---
if (loginForm) {
  loginForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const email = document.getElementById("username").value; // Pastikan ID di HTML adalah 'username'
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        window.location.href = "dashboard.html";
      })
      .catch((error) => alert("Gagal Masuk: Periksa kembali email & password!"));
  });
}

// --- FITUR UI: TOGGLE PASSWORD ---
if (togglePassword && passwordInput) {
  togglePassword.onclick = function() {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      togglePassword.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
    } else {
      passwordInput.type = "password";
      togglePassword.innerHTML = '<i class="fa-solid fa-eye"></i>';
    }
  };
}

// --- FITUR UI: DARK MODE ---
const toggleButton = document.getElementById("darkModeToggle");
if (toggleButton) {
  toggleButton.onclick = function() {
    document.body.classList.toggle("dark");
    toggleButton.innerHTML = document.body.classList.contains("dark") 
      ? '<i class="fa-solid fa-sun"></i>' 
      : '<i class="fa-solid fa-moon"></i>';
  };
}

// --- FITUR UI: NAVIGASI & HAMBURGER ---
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");

if (hamburger && navMenu) {
  hamburger.onclick = () => navMenu.classList.toggle("active");
}

// Navigasi halaman (Hapus class active lama, tambah ke yang baru)
const navButtons = document.querySelectorAll(".nav-btn");
const pages = document.querySelectorAll(".page");

navButtons.forEach(button => {
  button.addEventListener("click", () => {
    const pageId = button.dataset.page;
    if (pageId) {
      pages.forEach(p => p.classList.remove("active-page"));
      navButtons.forEach(b => b.classList.remove("active"));

      document.getElementById(pageId).classList.add("active-page");
      button.classList.add("active");
      if (navMenu) navMenu.classList.remove("active"); // Tutup menu di mobile
    }
  });
});