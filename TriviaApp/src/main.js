// src/main.js
import { login, register, logout } from "./auth";

document.addEventListener("DOMContentLoaded", () => {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
      try {
        await login(emailInput.value, passwordInput.value);
        alert("Inicio de sesión exitoso");
        window.location.href = "/trivia.html"; // Asegúrate que trivia.html exista
      } catch (error) {
        alert("Error al iniciar sesión: " + error.message);
      }
    });
  }

  if (registerBtn) {
    registerBtn.addEventListener("click", async () => {
      try {
        await register(emailInput.value, passwordInput.value);
        alert("Usuario registrado exitosamente");
      } catch (error) {
        alert("Error al registrarse: " + error.message);
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        await logout();
        alert("Sesión cerrada");
        window.location.href = "/";
      } catch (error) {
        alert("Error al cerrar sesión: " + error.message);
      }
    });
  }
});
