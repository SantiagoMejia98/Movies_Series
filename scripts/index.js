// Mapea los elementos DOM que desea actualizar
const elementos = {
    peliculas: document.querySelector('[data-name="peliculas"]'),
    series: document.querySelector('[data-name="series"]'),
    pelicula: document.querySelector('[data-name="pelicula"]'),
    serie: document.querySelector('[data-name="serie"]'),
    busqueda: document.querySelector('[data-name="busqueda"]')
};

const busquedaInput = document.getElementById('search-input');
const boton = document.getElementById('search-button');

// Función para crear la lista de películas o series
function crearListaPeliculas(elemento, datos) {
    // Verifica si hay un elemento <ul> dentro de la sección
    const ulExistente = elemento.querySelector('ul');

    // Si un elemento <ul> ya existe dentro de la sección, bórralo
    if (ulExistente) {
        elemento.removeChild(ulExistente);
    }

    const ul = document.createElement('ul');
    ul.className = 'lista';
    
    // Recorrer los datos para crear cada elemento <li> y añadirlo al <ul>
    datos.forEach(pelicula => {
        const li = document.createElement('li');
        li.className = 'card';
        
        li.innerHTML = `
            <div class="pelicula-container">
                <h2 class="titulo"><strong>${pelicula.Nombre}</strong></h2>
                <img src="${pelicula.Poster}" alt="${pelicula.Nombre}">
                <div class="informacion">
                    <p class="fecha"><strong>Estreno:</strong> ${pelicula.Lanzamiento}</p>
                    <p class="duracion"><strong>Duración:</strong> ${pelicula.Duracion}</p>
                    <p class="director"><strong>Director:</strong> ${pelicula.Director}</p>
                    <p class="actores"><strong>Actores:</strong> ${pelicula.Actores}</p>
                </div>
            </div>
        `;

        
        
        ul.appendChild(li);
    });

    elemento.appendChild(ul);
}

function crearListaBusqueda(elemento, datos) {
    // Verifica si hay un elemento <ul> dentro de la sección
    const ulExistente = elemento.querySelector('ul');

    // Si un elemento <ul> ya existe dentro de la sección, bórralo
    if (ulExistente) {
        elemento.removeChild(ulExistente);
    }

    const ul = document.createElement('ul');
    ul.className = 'lista';
    
    // Recorrer los datos para crear cada elemento <li> y añadirlo al <ul>
    datos.forEach(pelicula => {
        const li = document.createElement('li');
        li.className = 'card';
        
        li.innerHTML = `
            <div class="pelicula-container" id="${pelicula.Id}">
                <h2 class="titulo"><strong>${pelicula.Nombre}</strong></h2>
                <img src="https://image.tmdb.org/t/p/w500${pelicula.Poster}" alt="${pelicula.Nombre}">
                <div class="informacion">
                    <p class="fecha"><strong>Estreno:</strong> ${pelicula.Lanzamiento}</p>
                    <p class="tipo"><strong>Tipo:</strong> ${pelicula.Tipo}</p>
                    <button class="agregar-btn">Agregar</button>
                    <button class="eliminar-btn">Eliminar</button>
                </div>
            </div>
        `;
          
        ul.appendChild(li);
    });

    elemento.appendChild(ul);
}

// Funcion genérica para tratamiento de errores
function tratarConErrores(mensajeError) {
    console.error(mensajeError);
}

// Función para seleccionar elementos aleatorios
function seleccionarElementosAleatorios(array, numElementos) {
    const resultados = [];
    const arrayCopia = [...array];

    for (let i = 0; i < numElementos; i++) {
        const indiceAleatorio = Math.floor(Math.random() * arrayCopia.length);
        resultados.push(arrayCopia.splice(indiceAleatorio, 1)[0]);
    }

    return resultados;
}

let todasLasPeliculas = [];
let todasLasSeries = [];
let resultadosPeliculas = [];
let resultadosSeries = [];

// Cargar datos desde el archivo JSON en la carpeta public
function generaSeries() {
    const url = '/titulos.json'; // Ruta del JSON en la carpeta public

    fetch(url)
        .then(response => response.json())
        .then(data => {
            todasLasPeliculas = data.filter(item => item.Tipo === 'pelicula');
            todasLasSeries = data.filter(item => item.Tipo === 'serie');

            crearListaPeliculas(elementos.peliculas, todasLasPeliculas);
            crearListaPeliculas(elementos.series, todasLasSeries);
        })
        .catch(error => {
            tratarConErrores("Ocurrió un error al cargar los datos.");
        });
}

generaSeries();

// Función para mostrar un solo elemento y ocultar los demás
function mostrarSoloElemento(elementoAMostrar) {
    Object.values(elementos).forEach(elemento => {
        if (elemento === elementoAMostrar) {
            elemento.classList.remove('hidden');
        } else {
            elemento.classList.add('hidden');
        }
    });
}

let aleatorio = [];

// Mapea el dropdown menu
const dropdownMenu = document.getElementById('dropdown-menu');

// Función para mostrar la sección seleccionada
function manejarSeleccion(event) {
    const valorSeleccionado = event.target.value;
    
    switch (valorSeleccionado) {
        case 'peliculas':
            mostrarSoloElemento(elementos.peliculas);
            break;
        case 'series':
            mostrarSoloElemento(elementos.series);
            break;
        case 'pelicula':
            aleatorio = seleccionarElementosAleatorios(todasLasPeliculas, 1);
            crearListaPeliculas(elementos.pelicula, aleatorio);
            mostrarSoloElemento(elementos.pelicula);
            break;
        case 'serie':
            aleatorio = seleccionarElementosAleatorios(todasLasSeries, 1);
            crearListaPeliculas(elementos.serie, aleatorio);
            mostrarSoloElemento(elementos.serie);
            break;
        case 'busqueda':
            mostrarSoloElemento(elementos.busqueda);
            break;
    }
}

function buscar(){
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMGUxNDBmYzcyNGQ1OTFjMzAwMWJlNDQ4NDg4MjcxMiIsIm5iZiI6MTcyNTQ3NzAyMS40NzcsInN1YiI6IjY2ZDhiMDlkM2E5NGE0OWMxNjI2ZjAzZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.RdYktkxjOZERUNw2BaaX_ew5YAGVx2pJzAy5kHzi3RI'
        }
      };
      
      fetch('https://api.themoviedb.org/3/search/multi?query=breaking bad', options)
        .then(res => res.json())
        .then(res => {
            if (res.results) {
                let titulos = []
                res.results.forEach(titulo => {
                    const pelicula = {
                        "Nombre": titulo.title || titulo.name,
                        "Lanzamiento": titulo.release_date || titulo.first_air_date,
                        "Poster": titulo.poster_path,
                        "Id": titulo.id,
                        "Tipo": titulo.media_type
                    }
                    titulos.push(pelicula)
                })
                crearListaBusqueda(elementos.busqueda, titulos)
            } else {
                console.error("No se encontraron resultados");
            }
        })
        .then(ids => console.log(ids))            
        .catch(err => console.error(err));

    

      
}

// Añadir event listener al dropdown menu
dropdownMenu.addEventListener('change', manejarSeleccion);
boton.addEventListener('click', buscar);
            
// Delegación de eventos en el contenedor principal (elementos.busqueda)
document.querySelector('[data-name="busqueda"]').addEventListener('click', function(event) {
    // Verifica si el clic fue en uno de los botones de "Agregar" o "Eliminar"
    if (event.target.classList.contains('agregar-btn')) {
        alert(`Agregado: ${event.target.closest('.pelicula-container').id}`);
    } else if (event.target.classList.contains('eliminar-btn')) {
        alert(`Eliminado: ${event.target.closest('.pelicula-container').id}`);
    }
});
