// Exporta la función principal que muestra los favoritos en el contenedor dado
export function Favorites(container) {
  // Obtiene los favoritos del localStorage o inicializa un arreglo vacío si no hay ninguno
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  // Inicializa el contenido del contenedor con un título
  container.innerHTML = '<h2>Favoritos</h2>';

  // Si no hay favoritos guardados, muestra un mensaje y termina la función
  if (favorites.length === 0) {
    container.innerHTML += '<p>No tienes favoritos guardados.</p>';
    return;
  }

  // Recorre cada pregunta favorita para mostrarla en pantalla
  favorites.forEach(q => {
    const questionDiv = document.createElement('div');
    const encodedQuestion = encodeURIComponent(JSON.stringify(q)); // Codifica la pregunta para poder usarla en atributos HTML
    const answers = Array.isArray(q.answers) ? q.answers : []; // Asegura que las respuestas sean un arreglo

    // Construye el HTML para cada pregunta
    questionDiv.innerHTML = `
      <p><strong>${q.question}</strong></p>
      <ul>
        ${answers.map(ans => `<li>${ans}</li>`).join('')}
      </ul>
      <button class="remove-from-favorites-btn" data-question="${encodedQuestion}">Eliminar</button>
      <button class="edit-favorite-btn" data-question="${encodedQuestion}">Editar</button>
    `;
    container.appendChild(questionDiv); // Agrega el div al contenedor principal
  });

  // Maneja los clics dentro del contenedor
  container.addEventListener('click', (event) => {
    // Si se hace clic en el botón "Eliminar"
    if (event.target.classList.contains('remove-from-favorites-btn')) {
      const encoded = event.target.getAttribute('data-question');
      const question = JSON.parse(decodeURIComponent(encoded)); // Decodifica y parsea la pregunta
      removeFromFavorites(question); // Llama a la función para eliminar
    }

    // Si se hace clic en el botón "Editar"
    if (event.target.classList.contains('edit-favorite-btn')) {
      const encoded = event.target.getAttribute('data-question');
      const question = JSON.parse(decodeURIComponent(encoded));
      editFavorite(question); // Llama a la función para editar
    }
  });
}

// Elimina una pregunta de la lista de favoritos
function removeFromFavorites(question) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  favorites = favorites.filter(q => q.question !== question.question); // Filtra para eliminar la pregunta
  localStorage.setItem('favorites', JSON.stringify(favorites)); // Guarda la lista actualizada

  const app = document.getElementById('app');
  Favorites(app); // Vuelve a renderizar la lista
}

// Permite editar una pregunta favorita
function editFavorite(question) {
  const app = document.getElementById('app');
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  const allDivs = Array.from(app.querySelectorAll('div')); // Obtiene todos los divs dentro de app
  const questionDiv = allDivs.find(div => div.textContent.includes(question.question)); // Busca el div correspondiente a la pregunta

  if (!questionDiv) return;

  // Muestra un formulario para editar la pregunta
  questionDiv.innerHTML = `
    <label>Pregunta:</label>
    <input type="text" id="edit-question" value="${question.question}" style="width: 100%; margin-bottom: 8px;" />

    <label>Respuestas (separadas por coma):</label>
    <input type="text" id="edit-answers" value="${(Array.isArray(question.answers) ? question.answers : []).join(', ')}" style="width: 100%; margin-bottom: 8px;" />

    <label>Respuesta correcta:</label>
    <input type="text" id="edit-correct-answer" value="${question.correctAnswer || ''}" style="width: 100%; margin-bottom: 8px;" />

    <button id="save-edit">Guardar ✅</button>
    <button id="cancel-edit">Cancelar ❌</button>
  `;

  // Guardar cambios al hacer clic en "Guardar"
  questionDiv.querySelector('#save-edit').addEventListener('click', () => {
    const newQuestion = questionDiv.querySelector('#edit-question').value.trim();
    const newAnswersRaw = questionDiv.querySelector('#edit-answers').value.trim();
    const newCorrectAnswer = questionDiv.querySelector('#edit-correct-answer').value.trim();
    const newAnswers = newAnswersRaw.split(',').map(ans => ans.trim()); // Convierte el texto en array

    // Validaciones
    if (!newQuestion || newAnswers.length === 0 || !newCorrectAnswer) {
      alert('Por favor completa todos los campos.');
      return;
    }

    if (!newAnswers.includes(newCorrectAnswer)) {
      alert('La respuesta correcta debe estar entre las opciones.');
      return;
    }

    // Actualiza la lista de favoritos
    const updatedFavorites = favorites.map(q =>
      q.question === question.question
        ? { ...q, question: newQuestion, answers: newAnswers, correctAnswer: newCorrectAnswer }
        : q
    );

    localStorage.setItem('favorites', JSON.stringify(updatedFavorites)); // Guarda en localStorage
    Favorites(app); // Recarga la vista
  });

  // Cancela la edición y vuelve a la lista
  questionDiv.querySelector('#cancel-edit').addEventListener('click', () => {
    Favorites(app);
  });
}
