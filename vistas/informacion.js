// Exporta una función llamada 'info' que toma un contenedor HTML como argumento
export function info(container) {
  // Establece el contenido HTML del contenedor utilizando innerHTML
  container.innerHTML = `
    <div style="
      position: relative;
      overflow: hidden;
      padding: 20px;
      min-height: 100vh;
      font-family: 'Arial', sans-serif;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
    ">
      <!-- Capa de fondo borroso con una imagen -->
      <div style="
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: url('imagenes/imagen_iconica.gif'); /* Ruta de la imagen de fondo */
        background-size: cover; /* Asegura que la imagen cubra todo el fondo */
        background-position: center; /* Centra la imagen */
        filter: blur(10px); /* Aplica un desenfoque para un efecto borroso */
        z-index: 0; /* Coloca esta capa por debajo del contenido */
      "></div>

      <!-- Contenedor principal del contenido visible -->
      <div style="position: relative; z-index: 1; color: white;">
        <!-- Título de la sección -->
        <h1 style="font-size: 2.2em; margin-bottom: 15px; color: black;">
          API: Open Trivia DataBase "Opentdb"
        </h1>

        <!-- Imagen representativa de la trivia -->
        <img src="imagenes/tematica.png" alt="Trivia Icon" style="width: 150px; margin: 0 auto 20px;" />

        <!-- Caja de descripción de la aplicación -->
        <div style="
          background-color: rgba(0,0,0,0.6); /* Fondo oscuro semitransparente */
          padding: 15px;
          border-radius: 10px;
          margin: 0 auto 20px;
          width: 90%;
          max-width: 400px;
          font-size: 1em;
        ">
          <p>
            Esta app usa una API que ofrece preguntas de trivia de diferentes categorías como ciencia, cine, historia y más.
            ¡Perfecta para poner a prueba tus conocimientos!
          </p>
        </div>

        <!-- Enlaces de contacto e información de la app -->
        <p style="font-size: 1em; color: black;">
          GitHub: 
          <a href="https://github.com/Sanguzsua" target="_blank" style="color: black;">@Sanguzsua</a>
        </p>

        <!-- Versión de la aplicación -->
        <p style="font-size: 1em; color: black;">
          Versión de la app: <strong>V.1.0.0</strong>
        </p>

        <!-- Pie de página con el nombre del autor -->
        <footer style="margin-top: 30px; font-size: 0.9em; color: black;">
          Hecho por <strong>Santiago Guzman Suarez</strong>
        </footer>
      </div>
    </div>
  `;
}
