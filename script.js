// Importa las vistas de diferentes secciones de la aplicación
import { Home } from './vistas/home.js';
import { Quiz } from './vistas/trivia.js';
import { Favorites } from './vistas/favoritos.js';
import { Search } from './vistas/buscador.js';
import { Filter } from './vistas/filtro.js';
import { info } from './vistas/informacion.js';
import { TriviaConTiempo } from './vistas/triviacontiempo.js';

// Obtiene el contenedor principal donde se renderizará el contenido
const app = document.getElementById('app');

// Define las rutas disponibles para la navegación
const routes = {
  home: Home, // Página principal
  quiz: Quiz, // Página de preguntas
  favorites: Favorites, // Página de favoritos
  search: Search, // Página de búsqueda
  filter: Filter, // Página de filtro
  info: info, // Página de información
  triviaTiempo: TriviaConTiempo // Página de trivia con tiempo
};

// Función para manejar la navegación según la URL (hash)
function router() {
  const hash = location.hash.replace('#', '') || 'home'; // Obtiene el fragmento de la URL (hash) o usa 'home' como valor predeterminado
  const render = routes[hash]; // Obtiene la función correspondiente a la ruta

  if (render) {
    app.innerHTML = ''; // Limpia el contenedor antes de renderizar el nuevo contenido
    render(app); // Llama a la función correspondiente para renderizar la vista
  } else {
    app.innerHTML = '<h2>404 - Página no encontrada</h2>'; // Muestra un mensaje si la ruta no es válida
  }
}

// Función para agregar una pregunta a los favoritos y mostrar una alerta
window.addToFavorites = function (question) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || []; // Obtiene los favoritos del localStorage o crea un array vacío si no existen

  // Comprueba si la pregunta ya existe en los favoritos
  const exists = favorites.some(q => q.question === question.question);

  if (!exists) {
    favorites.push(question); // Si la pregunta no está en favoritos, la agrega
    localStorage.setItem('favorites', JSON.stringify(favorites)); // Guarda los favoritos en el localStorage
    alert('Pregunta añadida a favoritos ✅'); // Muestra una alerta si la pregunta se agregó correctamente
  } else {
    alert('La pregunta ya está en favoritos ❗'); // Muestra una alerta si la pregunta ya está en favoritos
  }
};

// Añade un evento para escuchar los cambios en el hash de la URL y activar el router
window.addEventListener('hashchange', router);

// Añade un evento para cargar la vista inicial cuando la página se carga
window.addEventListener('load', router);

