export function Quiz(container) {
  container.innerHTML = '<h2>Preguntas- Cargando preguntas...</h2>';

  fetch('https://opentdb.com/api.php?amount=5&type=multiple')
    .then(response => response.json())
    .then(data => {
      container.innerHTML = '<h2>Preguntas</h2>';
      data.results.forEach((q, i) => {
        const question = document.createElement('div');
        question.innerHTML = `
          <p><strong>Pregunta ${i + 1}:</strong> ${q.question}</p>
          <ul>
            ${[...q.incorrect_answers, q.correct_answer]
              .sort(() => Math.random() - 0.5)
              .map(ans => `<li>${ans}</li>`)
              .join('')}
          </ul>
          <button class="add-to-favorites-btn" data-question='${JSON.stringify(q)}'>Agregar a favoritos</button>
        `;
        
        // Asegúrate de agregar el botón de la pregunta al contenedor
        container.appendChild(question);
      });

      // Agregar el evento de clic después de renderizar las preguntas
      document.querySelectorAll('.add-to-favorites-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          const question = JSON.parse(this.getAttribute('data-question'));
          addToFavorites(question); // Llamada a la función global
        });
      });
    });
}
