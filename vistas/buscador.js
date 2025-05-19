// Exporta la función Search, que genera el formulario de búsqueda en el contenedor proporcionado
export function Search(container) {
  container.innerHTML = `
    <h2>Buscar Preguntas</h2>
    <input type="text" id="search-query" placeholder="Buscar por palabra clave (ej. Historia)">
    <button id="search-btn">Buscar</button>
    <div id="search-results"></div>
  `;

  // Obtiene los elementos del DOM relacionados con la búsqueda
  const searchButton = document.getElementById('search-btn');  // Botón de búsqueda
  const searchInput = document.getElementById('search-query');  // Campo de texto para ingresar la consulta
  const searchResults = document.getElementById('search-results');  // Contenedor donde se mostrarán los resultados de la búsqueda

  // Agrega un evento al botón de búsqueda para manejar la acción de búsqueda
  searchButton.addEventListener('click', async () => {
    const query = searchInput.value.trim().toLowerCase();  // Obtiene el valor del campo de búsqueda, lo limpia y lo pasa a minúsculas
    if (query) {  // Si la consulta no está vacía
      searchResults.innerHTML = 'Cargando...';  // Muestra un mensaje de carga mientras se obtienen los resultados
      const questions = await fetchQuestions(query);  // Llama a la función fetchQuestions con la consulta ingresada
      if (questions.length > 0) {  // Si se encuentran preguntas
        searchResults.innerHTML = questions.map(question => `<p>${question.question}</p>`).join('');  // Muestra las preguntas encontradas
      } else {  // Si no se encuentran preguntas
        searchResults.innerHTML = 'No se encontraron preguntas.';  // Muestra un mensaje indicando que no se encontraron resultados
      }
    }
  });

  // Función para hacer la consulta a la API de preguntas
  async function fetchQuestions(query) {
    try {
      // Realiza una solicitud fetch a la API de Open Trivia Database con la consulta proporcionada
      const response = await fetch(`https://opentdb.com/api.php?amount=10&type=multiple&difficulty=easy&category=23&query=${query}`);
      const data = await response.json();  // Convierte la respuesta en formato JSON
      return data.results;  // Devuelve las preguntas obtenidas de la respuesta
    } catch (error) {  // Si ocurre un error en la solicitud
      console.error('Error al obtener las preguntas:', error);  // Muestra el error en la consola
      return [];  // Devuelve un array vacío en caso de error
    }
  }
}
