// Exporta la función Filter, que recibe un contenedor para renderizar su contenido
export function Filter(container) {
  // Inserta el HTML inicial que incluye título, selector de categorías, botón y un div para los resultados
  container.innerHTML = `
    <h2>Filtrar por Categoría</h2>
    <select id="category-select">
      <option value="">Selecciona una categoría</option>
      <!-- Las opciones de categorías se cargarán dinámicamente aquí -->
    </select>
    <button id="filter-btn">Mostrar Preguntas</button>
    <div id="filter-results"></div>
  `;

  // Obtiene referencias a los elementos del DOM que se acaban de crear
  const categorySelect = document.getElementById('category-select');
  const filterButton = document.getElementById('filter-btn');
  const filterResults = document.getElementById('filter-results');

  // Función que obtiene las categorías desde la API y las agrega al selector
  async function loadCategories() {
    try {
      const response = await fetch('https://opentdb.com/api_category.php'); // Llama a la API de categorías
      const data = await response.json(); // Convierte la respuesta en JSON
      const categories = data.trivia_categories; // Extrae el array de categorías

      // Recorre las categorías y crea una opción para cada una en el selector
      categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
      });
    } catch (error) {
      // En caso de error, lo muestra en consola
      console.error('Error al cargar las categorías:', error);
    }
  }

  // Evento que se ejecuta al hacer clic en el botón "Mostrar Preguntas"
  filterButton.addEventListener('click', async () => {
    const categoryId = categorySelect.value; // Obtiene la categoría seleccionada
    if (categoryId) {
      filterResults.innerHTML = 'Cargando preguntas...'; // Muestra mensaje de carga
      const questions = await fetchQuestions(categoryId); // Llama a la función para obtener preguntas

      // Si hay preguntas, las muestra; si no, muestra mensaje correspondiente
      if (questions.length > 0) {
        filterResults.innerHTML = questions.map(question => `<p>${question.question}</p>`).join('');
      } else {
        filterResults.innerHTML = 'No se encontraron preguntas en esta categoría.';
      }
    } else {
      // Si no se seleccionó una categoría, muestra mensaje de advertencia
      filterResults.innerHTML = 'Por favor, selecciona una categoría.';
    }
  });

  // Función para obtener preguntas de la API según el ID de la categoría
  async function fetchQuestions(categoryId) {
    try {
      const response = await fetch(`https://opentdb.com/api.php?amount=10&type=multiple&category=${categoryId}`);
      const data = await response.json();
      return data.results; // Retorna el array de preguntas
    } catch (error) {
      console.error('Error al obtener las preguntas:', error);
      return []; // Devuelve arreglo vacío en caso de error
    }
  }

  // Llama a la función para cargar las categorías apenas se renderice el componente
  loadCategories();
}
