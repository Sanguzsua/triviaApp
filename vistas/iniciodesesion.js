import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

// Configuración de Firebase
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
const db = getFirestore(app);

// Elementos del DOM
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const logoutBtn = document.getElementById('logoutBtn');

// Iniciar sesión
if (loginBtn) {
  loginBtn.addEventListener('click', async () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Inicio de sesión correcto');
      emailInput.value = '';
      passwordInput.value = '';

      // Cargar favoritos del usuario desde Firestore
      const user = auth.currentUser;
      if (user) {
        const favoritosRef = collection(db, "favoritos");
        const q = query(favoritosRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        const favoritos = [];
        querySnapshot.forEach(docSnap => {
          const data = docSnap.data();
          favoritos.push({
            question: data.pregunta,
            correctAnswer: data.correcta,
            answers: [...data.incorrectas, data.correcta],
            category: data.categoria,
            difficulty: data.dificultad,
            type: data.tipo,
          });
        });

        localStorage.setItem('favorites', JSON.stringify(favoritos));
      }

      window.location.href = 'index.html';
    } catch (error) {
      alert('Error al iniciar sesión: ' + error.message);
    }
  });
}

// Registrar nuevo usuario
if (registerBtn) {
  registerBtn.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        alert('Registro exitoso. Ahora puedes iniciar sesión.');
        emailInput.value = '';
        passwordInput.value = '';
        window.location.href = 'index.html';
      })
      .catch(error => {
        alert('Error en el registro: ' + error.message);
      });
  });
}

// Cerrar sesión
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    signOut(auth)
      .then(() => {
        alert('Sesión cerrada');
        localStorage.removeItem('favorites');
        window.location.href = 'index.html';
      })
      .catch(error => {
        alert('Error al cerrar sesión: ' + error.message);
      });
  });
}

// Función para guardar favoritos en Firestore
async function addToFavorites(question) {
  const user = auth.currentUser;
  if (!user) {
    alert("Debes iniciar sesión para guardar favoritos");
    return;
  }

  const triviaId = question.question.slice(0, 10).replace(/\W/g, '') + "_" + Date.now();

  try {
    await setDoc(doc(db, "favoritos", `${user.uid}_${triviaId}`), {
      userId: user.uid,
      pregunta: question.question,
      correcta: question.correctAnswer || question.correct_answer,
      incorrectas: question.incorrectAnswers || question.incorrect_answers,
      categoria: question.category,
      dificultad: question.difficulty,
      tipo: question.type,
      guardadoEn: new Date()
    });
    alert("Pregunta agregada a favoritos correctamente");
  } catch (error) {
    alert("Error al guardar favorito: " + error.message);
  }
}

// Exportaciones para otros módulos
export { auth, db, addToFavorites };
