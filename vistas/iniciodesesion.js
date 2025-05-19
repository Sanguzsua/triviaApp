import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCdhlk4Iq6gFU6-95E18zjum1x9EdOiP6Y",
  authDomain: "triviapp-a333f.firebaseapp.com",
  projectId: "triviapp-a333f",
  storageBucket: "triviapp-a333f.appspot.com",
  messagingSenderId: "293992371838",
  appId: "1:293992371838:web:cc79d0e2f2adf05d7c6a2f",
  measurementId: "G-XZJFNL36PB"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const logoutBtn = document.getElementById('logoutBtn');

loginBtn.addEventListener('click', () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert('Inicio de sesión correcto');
      emailInput.value = '';
      passwordInput.value = '';
      // Redirigir a la página principal de la trivia
      window.location.href = 'index.html'; 
    })
    .catch(error => alert('Error al iniciar sesión: ' + error.message));
});

registerBtn.addEventListener('click', () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert('Registro exitoso, ahora inicia sesión');
      emailInput.value = '';
      passwordInput.value = '';
      // Opcional: redirigir también después del registro
      window.location.href = 'index.html'; 
    })
    .catch(error => alert('Error en registro: ' + error.message));
});

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    signOut(auth).then(() => {
      alert('Sesión cerrada');
      window.location.href = 'index.html'; // o la página de login
    }).catch(error => alert('Error al cerrar sesión: ' + error.message));
  });
}
