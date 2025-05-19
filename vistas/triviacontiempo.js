export function TriviaConTiempo(container) {
  // Cargar preguntas favoritas del localStorage
  let favorites = (JSON.parse(localStorage.getItem('favorites')) || []).map(q => {
      return {
          question: q.question,
          correctAnswer: q.correctAnswer || q.correct_answer || 'Respuesta no disponible',
          incorrectAnswers: q.incorrectAnswers || q.incorrect_answers || [],
      };
  });

  if (favorites.length === 0) {
      container.innerHTML = '<h2>No tienes preguntas en favoritos para jugar.</h2>';
      return;
  }

  let currentIndex = 0;
  let score = 0;
  let timer = null;
  let timeLeft = 15;

  const showQuestion = () => {
      const question = favorites[currentIndex];

      // Validación de datos
      if (!question.correctAnswer) {
          console.warn('Pregunta sin respuesta correcta:', question);
          question.correctAnswer = 'Respuesta no disponible';
      }

      if (!Array.isArray(question.incorrectAnswers)) {
          question.incorrectAnswers = question.incorrectAnswers ? [question.incorrectAnswers] : [];
      }

      // Mezclar respuestas
      const answers = [question.correctAnswer, ...question.incorrectAnswers];
      const shuffledAnswers = shuffleArray(answers);

      container.innerHTML = `
          <h2>Trivia con Tiempo ⏱️</h2>
          <p><strong>Pregunta ${currentIndex + 1}:</strong> ${question.question}</p>
          <div id="answers">
              ${shuffledAnswers.map(ans => `<button class="answer-btn">${ans}</button>`).join('')}
          </div>
          <p>Tiempo restante: <span id="timer">${timeLeft}</span> segundos</p>
      `;

      // Escuchar clics en las respuestas
      document.querySelectorAll('.answer-btn').forEach(btn => {
          btn.addEventListener('click', () => {
              clearInterval(timer);
              if (btn.textContent === question.correctAnswer) {
                  score++;
              }
              nextQuestion();
          });
      });

      // Iniciar temporizador
      timer = setInterval(() => {
          timeLeft--;
          document.getElementById('timer').textContent = timeLeft;
          if (timeLeft === 0) {
              clearInterval(timer);
              nextQuestion(); // Pasar sin sumar puntos
          }
      }, 1000);
  };

  const nextQuestion = () => {
      currentIndex++;
      timeLeft = 15;
      if (currentIndex < favorites.length) {
          showQuestion();
      } else {
          showResult();
      }
  };

  const showResult = () => {
      container.innerHTML = `
          <h2>Resultado final 🏁</h2>
          <p>Tu puntaje: ${score} de ${favorites.length}</p>
          <button id="retry-btn">Volver a jugar 🔁</button>
      `;

      document.getElementById('retry-btn').addEventListener('click', () => {
          currentIndex = 0;
          score = 0;
          timeLeft = 15;
          showQuestion();
      });
  };

  // Mezclar respuestas aleatoriamente
  function shuffleArray(array) {
      return array.sort(() => Math.random() - 0.5);
  }

  // Iniciar trivia
  showQuestion();
}
