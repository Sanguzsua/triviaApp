// Solo importa auth y db desde tu archivo
import { auth, db } from './iniciodesesion.js';

// Importa funciones de Firestore directamente desde Firebase
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  updateDoc,
  doc
} from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js';


export async function Favorites(container) {
  await loadFavoritesFromFirestore();

  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  container.innerHTML = '<h2>Favoritos</h2>';

  if (favorites.length === 0) {
    container.innerHTML += '<p>No tienes favoritos guardados.</p>';
    return;
  }

  favorites.forEach(q => {
    // Mezclar respuestas correcta e incorrectas para mostrar opciones desordenadas
    const respuestas = [q.correcta, ...q.incorrectas];
    const shuffledAnswers = respuestas.sort(() => Math.random() - 0.5);

    const questionDiv = document.createElement('div');
    const encodedQuestion = encodeURIComponent(JSON.stringify(q));

    questionDiv.innerHTML = `
      <p><strong>${q.pregunta}</strong></p>
      <ul>
        ${shuffledAnswers.map(ans => `<li>${ans}</li>`).join('')}
      </ul>
      <button class="remove-from-favorites-btn" data-question="${encodedQuestion}">Eliminar</button>
      <button class="edit-favorite-btn" data-question="${encodedQuestion}">Editar</button>
      <hr>
    `;

    container.appendChild(questionDiv);
  });

  container.addEventListener('click', async (event) => {
    if (event.target.classList.contains('remove-from-favorites-btn')) {
      const encoded = event.target.getAttribute('data-question');
      const question = JSON.parse(decodeURIComponent(encoded));
      await removeFromFavorites(question);
      Favorites(container);  // refrescar lista
    }

    if (event.target.classList.contains('edit-favorite-btn')) {
      const encoded = event.target.getAttribute('data-question');
      const question = JSON.parse(decodeURIComponent(encoded));
      editFavorite(question, container);
    }
  });
}

async function removeFromFavorites(question) {
  const user = auth.currentUser;
  if (!user) {
    alert('Usuario no autenticado');
    return;
  }

  const favoritosRef = collection(db, "favoritos");
  const q = query(favoritosRef, where("userId", "==", user.uid), where("pregunta", "==", question.pregunta));
  const querySnapshot = await getDocs(q);

  for (const docSnap of querySnapshot.docs) {
    await deleteDoc(doc(db, "favoritos", docSnap.id));
  }

  // Actualizar localStorage
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  favorites = favorites.filter(q => q.pregunta !== question.pregunta);
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

function editFavorite(question, container) {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  container.innerHTML = '<h2>Editar favorito</h2>';

  // Combinar las incorrectas en una cadena para el input
  const incorrectasStr = Array.isArray(question.incorrectas) ? question.incorrectas.join(', ') : '';

  container.innerHTML += `
    <label>Pregunta:</label><br/>
    <input type="text" id="edit-question" value="${question.pregunta}" style="width: 100%; margin-bottom: 8px;" />

    <label>Respuestas incorrectas (separadas por coma):</label><br/>
    <input type="text" id="edit-incorrectas" value="${incorrectasStr}" style="width: 100%; margin-bottom: 8px;" />

    <label>Respuesta correcta:</label><br/>
    <input type="text" id="edit-correcta" value="${question.correcta}" style="width: 100%; margin-bottom: 8px;" />

    <button id="save-edit">Guardar ✅</button>
    <button id="cancel-edit">Cancelar ❌</button>
  `;

  container.querySelector('#save-edit').addEventListener('click', async () => {
    const newPregunta = container.querySelector('#edit-question').value.trim();
    const newIncorrectasRaw = container.querySelector('#edit-incorrectas').value.trim();
    const newCorrecta = container.querySelector('#edit-correcta').value.trim();

    const newIncorrectas = newIncorrectasRaw.split(',').map(ans => ans.trim()).filter(ans => ans.length > 0);

    if (!newPregunta || newIncorrectas.length === 0 || !newCorrecta) {
      alert('Por favor completa todos los campos.');
      return;
    }

    if (newIncorrectas.includes(newCorrecta)) {
      alert('La respuesta correcta no puede estar entre las respuestas incorrectas.');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      alert('Usuario no autenticado');
      return;
    }

    const newFavorite = {
      ...question,
      pregunta: newPregunta,
      incorrectas: newIncorrectas,
      correcta: newCorrecta,
      userId: user.uid,
      guardadoEn: question.guardadoEn,
      categoria: question.categoria,
      dificultad: question.dificultad,
      tipo: question.tipo,
    };

    // Actualizar Firestore
    const favoritosRef = collection(db, "favoritos");
    const q = query(favoritosRef, where("userId", "==", user.uid), where("pregunta", "==", question.pregunta));
    const querySnapshot = await getDocs(q);

    for (const docSnap of querySnapshot.docs) {
      await updateDoc(doc(db, "favoritos", docSnap.id), newFavorite);
    }

    // Actualizar localStorage
    const updatedFavorites = favorites.map(fav =>
      fav.pregunta === question.pregunta ? newFavorite : fav
    );
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));

    Favorites(container);
  });

  container.querySelector('#cancel-edit').addEventListener('click', () => {
    Favorites(container);
  });
}

async function loadFavoritesFromFirestore() {
  const user = auth.currentUser;
  if (!user) {
    localStorage.setItem('favorites', JSON.stringify([]));
    return;
  }

  const favoritosRef = collection(db, "favoritos");
  const q = query(favoritosRef, where("userId", "==", user.uid));
  const querySnapshot = await getDocs(q);

  const favoritos = [];
  querySnapshot.forEach(docSnap => {
    favoritos.push(docSnap.data());
  });

  localStorage.setItem('favorites', JSON.stringify(favoritos));
}
