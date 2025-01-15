const get = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMGUxNDBmYzcyNGQ1OTFjMzAwMWJlNDQ4NDg4MjcxMiIsIm5iZiI6MTcyNTQ3NzAyMS40NzcsInN1YiI6IjY2ZDhiMDlkM2E5NGE0OWMxNjI2ZjAzZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.RdYktkxjOZERUNw2BaaX_ew5YAGVx2pJzAy5kHzi3RI",
  },
};

const dropdownMenu = document.getElementById("dropdown-menu");

const elementos = {
  busqueda: document.querySelector('[data-name="busqueda"]'),
  peliculas_presentes: document.querySelector(
    '[data-name="peliculas_presentes"]'
  ),
  series_presentes: document.querySelector('[data-name="series_presentes"]'),
  peliculas_nuevas: document.querySelector('[data-name="peliculas_nuevas"]'),
  series_nuevas: document.querySelector('[data-name="series_nuevas"]'),
};

let todasLasPeliculas = [];
let aleatorio = [];

function crearlistaInicio(elemento, datos) {
  const ulExistente = elemento.querySelector("ul");

  if (ulExistente) {
    elemento.removeChild(ulExistente);
  }

  const ul = document.createElement("ul");
  ul.className = "lista";

  datos.forEach((pelicula) => {
    const li = document.createElement("li");
    li.className = "card";

    li.innerHTML = `
              <div class="pelicula-container" id="${pelicula.Id}">
                  <h2 class="titulo"><strong>${pelicula.Nombre}</strong></h2>
                  <img src="https://image.tmdb.org/t/p/w500${pelicula.Poster}" alt="${pelicula.Nombre}">
                  <div class="informacion">
                      <p class="lanzamiento"><strong>Lanzamiento:</strong> ${pelicula.Lanzamiento}</p>
                      <p class="hidden" id="tipo">${pelicula.Tipo}</p>
                      <button class="completo">Completo</button>
                  </div>
              </div>
          `;

    ul.appendChild(li);
  });

  elemento.appendChild(ul);
}

function seleccionarElementosAleatorios(array, numElementos) {
  const resultados = [];
  const arrayCopia = [...array];

  for (let i = 0; i < numElementos; i++) {
    const indiceAleatorio = Math.floor(Math.random() * arrayCopia.length);
    resultados.push(arrayCopia.splice(indiceAleatorio, 1)[0]);
  }

  return resultados[0].Id;
}

function manejarSeleccion(event) {
  const valorSeleccionado = event.target.value;
  let ruta;
  switch (valorSeleccionado) {
    case "seleccionar":
      ruta = "index.html";
      break;
    case "peliculas":
      ruta = "peliculas.html";
      break;
    case "series":
      ruta = "series.html";
      break;
    case "pelicula":
      ruta = "pelicula.html";
      break;
    case "serie":
      ruta = "serie.html";
      break;
    case "busqueda":
      ruta = "busqueda.html";
      break;
  }
  if (ruta) {
    window.location.href = ruta;
  } else {
    console.error("No se definió una ruta para la selección.");
  }
}

function cargarDatos(lista) {
  fetch(`https://api.themoviedb.org/3/account/21500820/watchlist/movies`, get)
    .then((res) => res.json())
    .then((res) => {
      if (res.results) {
        lista = res.results.map((item) => item.id);
      } else {
        console.error("No se encontraron resultados");
      }
    })
    .catch((err) => console.error(err));
}

cargarDatos(todasLasPeliculas);

function JSONpelicula(titulo, lista) {
  let resultado = [];
  const pelicula = {
    Nombre:
      titulo.title ||
      titulo.name ||
      titulo.original_title ||
      titulo.original_name,
    Lanzamiento: titulo.release_date || titulo.first_air_date,
    Poster: titulo.poster_path,
    Id: titulo.id,
    Tipo: "movie",
    Duracion: titulo.runtime,
    Collecion: titulo.belongs_to_collection
      ? titulo.belongs_to_collection.id
      : "no",
    Generos: titulo.genres?.map((genre) => genre.name).join(", ") || "",
    Status: titulo.status,
    Videos: titulo.videos?.results || [],
    Portada: titulo.backdrop_path,
    Creditos: titulo.credits?.cast || [],
    Proveedores:
      titulo["watch/providers"]?.results?.CO?.flatrate || "No disponible",
    Descripcion: titulo.overview,
  };
  resultado.push(pelicula);
  lista = resultado;
  crearPeliculaDetalles(elementos.pelicula, lista);
  mostrarSoloElemento(elementos.pelicula);
}

function buscarDetalles(tipo, id, lista) {
  fetch(
    `https://api.themoviedb.org/3/${tipo}/${id}?append_to_response=credits,videos,watch/providers`,
    get
  )
    .then((res) => res.json())
    .then((res) => {
      if (res) {
        if (tipo === "movie") {
          JSONpelicula(res, lista);
        } else {
          JSONserie(res, lista);
        }
      } else {
        console.error("No se encontraron resultados");
      }
    })
    .catch((err) => console.error(err));
}

function buscarColeccion(id) {
  fetch(`https://api.themoviedb.org/3/collection/${id}`, get)
    .then((res) => res.json())
    .then((res) => {
      res.parts.forEach((titulo) => {});
    })
    .catch((err) => console.error(err));
}

dropdownMenu.addEventListener("change", manejarSeleccion);

document.querySelectorAll(".bookmark-item").forEach((item) => {
  item.addEventListener("click", function () {
    const icon = this.querySelector("i");

    // Alternar entre icono vacío y relleno
    if (icon.classList.contains("fa-regular")) {
      icon.classList.remove("fa-regular");
      icon.classList.add("fa-solid");
    } else {
      icon.classList.remove("fa-solid");
      icon.classList.add("fa-regular");
    }

    // Alternar la clase "filled" para cambiar el color
    this.classList.toggle("filled");
  });
});

function openTrailer() {
  const modal = document.getElementById("trailerModal");
  modal.style.display = "block"; // Muestra el modal
}

// Función para cerrar el modal
function closeTrailer() {
  const modal = document.getElementById("trailerModal");
  modal.style.display = "none";
}

document.addEventListener("DOMContentLoaded", function () {
  const movieItem = document.querySelector(".movie-item");
  movieItem.addEventListener("click", function () {
    openTrailer();
  });
  const closeBtn = document.querySelector(".close");
  closeBtn.addEventListener("click", closeTrailer);
});


