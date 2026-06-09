// ISI BAGIAN ATAS KODE KAMU SANGAT DISARANKAN MENJADI SEPERTI INI:

// 1. Impor App
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";

// 2. Impor Auth
import { getAuth, signOut, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// 3. UBAH BAGIAN INI: Tambahkan dbRef dan onValue
import { getDatabase, ref as dbRef, onValue, push, remove } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// 4. Impor Storage (Tetap seperti milikmu sebelumnya)
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

// 2. CONFIGURATION
const firebaseConfig = {
  apiKey: "AIzaSyDY-tzijy0z5yfD_U7dn0YHXXh5NLXOHJ8",
  authDomain: "kogniscio.firebaseapp.com",
  databaseURL: "https://kogniscio-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kogniscio",
  storageBucket: "kogniscio.firebasestorage.app",
  messagingSenderId: "146030907751",
  appId: "1:146030907751:web:a646d0786595bafe819fc2",
  measurementId: "G-G7JBCHP9VE"
};

// 3. INITIALIZE
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app); // Pastikan getDatabase sudah di-import dari firebase/database
const storage = getStorage(app);

// Pembungkus Async untuk proses upload
async function handleFileUpload() {
  const fileInput = document.getElementById("contentFile");
  if (!fileInput || !fileInput.files.length) return null; // Proteksi jika elemen tidak ada/kosong

  const file = fileInput.files[0];
  const fileRef = storageRef(storage, `uploads/${Date.now()}_${file.name}`);

  try {
    await uploadBytes(fileRef, file);
    const downloadUrl = await getDownloadURL(fileRef);
    return downloadUrl; // Mengembalikan URL untuk dipakai di objek 'data'
  } catch (error) {
    console.error("Gagal mengupload file:", error);
    return null;
  }
}

// CONTOH PENGGUNAAN FUNGSI UPLOAD:
// (Panggil fungsi ini di dalam event listener tombol submit form kamu yang juga bertipe async)
/*
   const fileUrl = await handleFileUpload();
   if (fileUrl) { data.fileUrl = fileUrl; }
*/


const ADMIN_EMAIL = "solburnicarus@gmail.com";

if (window.location.pathname.includes("dashboard.html")) {
  onAuthStateChanged(auth, (user) => {

    if (!user) {
      window.location.href = "index.html";
      return;
    }

    const roleBadge = document.getElementById("roleBadge");
    const createButton =
      document.querySelector('[data-page="create"]');


    if (user.email === ADMIN_EMAIL) {

      roleBadge.innerHTML =
        '<i class="fa-solid fa-shield-halved"></i> Administrator';

      document.body.classList.add("admin-mode");

      if (createButton)
        createButton.style.display = "flex";

    } else {

      roleBadge.innerHTML =
        '<i class="fa-solid fa-user-graduate"></i> Mahasiswa';

      if (createButton)
        createButton.style.display = "none";

    }

  });
}

// 4. ELEMENT SELECTORS
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const loginBox = document.getElementById('loginBox');
const registerBox = document.getElementById('registerBox');
const toRegister = document.getElementById('toRegister');
const toLogin = document.getElementById('toLogin');

// Selector Fitur Mata (Login)
const togglePassword = document.querySelector(".toggle-password");
const passwordInput = document.getElementById("password");

// Selector Fitur Mata Baru (Register)
const togglePasswordReg = document.querySelector(".toggle-password-reg");
const regPasswordInput = document.getElementById("regPassword");

// Selector Upload Foto Profil
const avatarInput = document.getElementById("avatarInput");
const profileAvatar = document.getElementById("profileAvatar");


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
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("regEmail").value;
    const password = regPasswordInput.value;

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        alert("Akun sukses dibuat! Silakan login.");
        registerBox.style.display = 'none';
        loginBox.style.display = 'block';
      })
      .catch((error) => {
        console.log(error);
        alert(error.code + " | " + error.message);
      });
  });
}


// --- LOGIKA FIREBASE: LOGIN ---
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("username").value;
    const password = passwordInput.value;

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        window.location.href = "dashboard.html";
      })
      .catch((error) => {
        console.log(error);
        alert("Gagal Masuk: Periksa kembali email & password!");
      });
  });
}


// --- FITUR UI: TOGGLE PASSWORD (LOGIN) ---
if (togglePassword && passwordInput) {
  togglePassword.onclick = function () {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      togglePassword.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
    } else {
      passwordInput.type = "password";
      togglePassword.innerHTML = '<i class="fa-solid fa-eye"></i>';
    }
  };
}


// --- FITUR UI: TOGGLE PASSWORD (REGISTER) ---
if (togglePasswordReg && regPasswordInput) {
  togglePasswordReg.onclick = function () {
    if (regPasswordInput.type === "password") {
      regPasswordInput.type = "text";
      togglePasswordReg.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
    } else {
      regPasswordInput.type = "password";
      togglePasswordReg.innerHTML = '<i class="fa-solid fa-eye"></i>';
    }
  };
}


// --- FITUR UI: UPLOAD & PREVIEW FOTO PROFIL ---

// 1. CEK SAAT HALAMAN DIBUKA (Agar foto tetap muncul setelah refresh)
document.addEventListener("DOMContentLoaded", () => {

  onAuthStateChanged(auth, (user) => {

    if (!user || !profileAvatar) return;

    const savedAvatar =
      localStorage.getItem(`avatar_${user.uid}`);

    if (savedAvatar) {
      profileAvatar.src = savedAvatar;
    }

  });

});

// 2. PROSES UPLOAD
if (avatarInput && profileAvatar) {

  avatarInput.onchange = function () {

    const file = avatarInput.files[0];

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran file terlalu besar! Maksimal 2MB.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Harap pilih file gambar saja!");
      return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {

      const base64Image = e.target.result;

      profileAvatar.src = base64Image;

      try {

        if (auth.currentUser) {
          localStorage.setItem(
            `avatar_${auth.currentUser.uid}`,
            base64Image
          );
        }

      } catch (error) {

        alert(
          "Gagal menyimpan foto. File terlalu besar atau storage penuh."
        );

      }

    };

    reader.readAsDataURL(file);

  };

}


// --- FITUR UI: DARK MODE ---
const toggleButton = document.getElementById("darkModeToggle");

if (toggleButton) {

  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    toggleButton.innerHTML = '<i class="fa-solid fa-sun"></i>';
  } else {
    toggleButton.innerHTML = '<i class="fa-solid fa-moon"></i>';
  }

  toggleButton.onclick = function () {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
      localStorage.setItem("theme", "dark");
      toggleButton.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
      localStorage.setItem("theme", "light");
      toggleButton.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }
  };

}


// --- FITUR UI: NAVIGASI BOTTOM NAV ---
const navButtons = document.querySelectorAll(".nav-btn");
const pages = document.querySelectorAll(".page");

navButtons.forEach(button => {
  button.addEventListener("click", () => {
    const pageId = button.dataset.page;
    if (pageId) {
      const targetPage = document.getElementById(pageId);

      // Validasi: pastikan element target halaman memang ada di HTML
      if (targetPage) {
        pages.forEach(p => p.classList.remove("active-page"));
        navButtons.forEach(b => b.classList.remove("active"));

        targetPage.classList.add("active-page");
        button.classList.add("active");
      } else {
        console.warn(`Halaman dengan ID "${pageId}" tidak ditemukan di HTML.`);
      }
    }
  });
});

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.onclick = () => {
    signOut(auth).then(() => {
      window.location.href = "index.html";
    });
  };
}

const feedContainer =
  document.getElementById("feedContainer");

if (feedContainer) {

  onValue(dbRef(db, "feeds"), (snapshot) => { //  Menggunakan dbRef yang baru di-import
    feedContainer.innerHTML = "";

    const data = snapshot.val();

    if (!data) return;

    Object.keys(data)
      .reverse()
      .forEach(key => {

        const post = data[key];

        feedContainer.innerHTML += `
        <div class="feed-community-card">

          <div class="post-header">
            <h4>KOGNISCIO</h4>
          </div>

          <h3>${post.title}</h3>

          <p>${post.content}</p>

        </div>
      `;
      });

  });

}

const publishBtn =
  document.getElementById("publishBtn");

if (publishBtn) {

  publishBtn.onclick = async () => {

    const user =
      auth.currentUser;

    if (
      !user ||
      user.email !== ADMIN_EMAIL
    ) {
      alert("Hanya admin.");
      return;
    }

    const type =
      document.getElementById("contentType").value;

    const title =
      document.getElementById("contentTitle").value;

    if (!title) {
      alert("Isi judul");
      return;
    }

    let data = {
      title,
      createdAt: Date.now(),
      status: document.getElementById("contentStatus").value
    };

    if (type === "materials") {

      data.link =
        document.getElementById("materialLink").value;

    }

    if (type === "videos") {

      data.link =
        document.getElementById("videoLink").value;

    }

    if (type === "feeds") {

      data.content =
        document.getElementById("feedContent").value;

    }

    const fileUrl =
      await handleFileUpload();

    if (fileUrl) {
      data.fileUrl = fileUrl;
    }

    await push(
      dbRef(db, type),
      data
    );

    alert("Konten berhasil dipublish");

  };

}

const materialsContainer =
  document.getElementById("materialsContainer");

if (materialsContainer) {

  onValue(
    dbRef(db, "materials"),
    snapshot => {

      const data = snapshot.val();

      if (!data) return;

      materialsContainer.innerHTML = "";
      Object.keys(data)
        .reverse()
        .forEach(key => {

          const post = data[key];

          if (post.status !== "published") return;

          const item = data[key];

          if (item.status !== "published")
            return;

          materialsContainer.innerHTML += `
          <div class="course-card">

            <img
             src="assets/images/image1.jpeg"
             class="course-thumb">

            <h3>${item.title}</h3>

            <a
             href="${item.link}"
             target="_blank"
             class="btn">
              Buka
            </a>

          </div>
        `;

        });

    }
  );

}

const videosContainer =
  document.getElementById("videosContainer");

if (videosContainer) {

  onValue(
    dbRef(db, "videos"),
    snapshot => {

      videosContainer.innerHTML = "";

      const data =
        snapshot.val();

      if (!data) return;

      Object.keys(data)
        .reverse()
        .forEach(key => {

          const item = data[key];

          videosContainer.innerHTML += `
          <div class="feed-video-card">

            <iframe
             width="100%"
             height="300"
             src="${item.link.replace("watch?v=", "embed/")}"
             allowfullscreen>
            </iframe>

            <div style="padding:15px">
              <h3>${item.title}</h3>
            </div>

          </div>
        `;

        });

    }
  );

}

window.switchAdminForm = function () {

  const type =
    document.getElementById("contentType").value;

  const dynamicInputs =
    document.getElementById("dynamicInputs");

  if (type === "materials") {

    dynamicInputs.innerHTML = `
      <input
        type="text"
        id="materialLink"
        placeholder="Link Materi">
    `;

  }

  if (type === "videos") {

    dynamicInputs.innerHTML = `
      <input
        type="text"
        id="videoLink"
        placeholder="Link Youtube">
    `;

  }

  if (type === "feeds") {

    dynamicInputs.innerHTML = `
      <textarea
        id="feedContent"
        placeholder="Isi Pengumuman"></textarea>
    `;

  }

};

window.deletePost = function (key) {
  if (confirm("Hapus postingan ini?")) {
    // Dipastikan path-nya sama dengan tempat kamu menyimpan data ("feeds")
    remove(dbRef(db, "feeds/" + key))
      .then(() => {
        alert("Postingan berhasil dihapus");
      })
      .catch((error) => {
        console.error(error);
        alert("Gagal menghapus postingan");
      });
  }
};
