// Exporta la función Home, que recibe como parámetro un contenedor (elemento del DOM donde se mostrará el contenido)
export function Home(container) {
  // Define el contenido HTML que se insertará en el contenedor
  container.innerHTML = `
    <div style="
      text-align: center;/*centra el texto horizontalmente*/
      padding: 20px;/*espaciado interno alrededor del contenido*/
      display: flex;/*usa flexbox para alinear elementos*/
      flex-direction: column;/*organiza los hijos en columna*/
      align-items: center;/*centra horizontalmente los elementos hijos*/
    ">
      <!--imagen de bienvenida-->
      <img src="imagenes/bienvenida.png" 
           alt="bienvenido"/*texto alternativo para accesibilidad*/
           style="
             max-width: 90%;/*limita el ancho máximo al 90% del contenedor*/
             height: 10%;/*define una altura relativa*/
             border-radius: 20px;/*bordes redondeados para la imagen*/
             box-shadow: 0 4px 12px rgba(0,0,0,0.3);/*sombra para dar profundidad*/
             margin-bottom: 20px;/*espacio inferior entre la imagen y lo siguiente*/
           " />
    </div>
  `;
}
