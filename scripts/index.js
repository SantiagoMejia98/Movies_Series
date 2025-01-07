const elementos = {
  peliculas: document.querySelector('[data-name="peliculas"]'),
  series: document.querySelector('[data-name="series"]')
};

const get = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMGUxNDBmYzcyNGQ1OTFjMzAwMWJlNDQ4NDg4MjcxMiIsIm5iZiI6MTcyNTQ3NzAyMS40NzcsInN1YiI6IjY2ZDhiMDlkM2E5NGE0OWMxNjI2ZjAzZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.RdYktkxjOZERUNw2BaaX_ew5YAGVx2pJzAy5kHzi3RI",
  },
};

const dropdownMenu = document.getElementById("dropdown-menu");

let todasLasPeliculas = [];
let todasLasSeries = [];
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





function crearPeliculaDetalles(elemento, datos) {
  console.log(datos);
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
                    <p class="fecha"><strong>Estreno:</strong> ${pelicula.Lanzamiento}</p>
                    <p class="hidden" id="tipo">${pelicula.Tipo}</p>
                    <button class="eliminar-btn">Eliminar</button>
                </div>
            </div>
        `;

    ul.appendChild(li);
  });

  elemento.appendChild(ul);
}

function crearSerieDetalles(elemento, datos) {
  console.log(datos);
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
                    <p class="fecha"><strong>Estreno:</strong> ${pelicula.Lanzamiento}</p>
                    <p class="hidden" id="tipo">${pelicula.Tipo}</p>
                    <button class="eliminar-btn">Eliminar</button>
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

function mostrarSoloElemento(elementoAMostrar) {
  Object.values(elementos).forEach((elemento) => {
    if (elemento === elementoAMostrar) {
      elemento.classList.remove("hidden");
    } else {
      elemento.classList.add("hidden");
    }
  });
}

function manejarSeleccion(event) {
  const valorSeleccionado = event.target.value;
  let ruta;
  switch (valorSeleccionado) {
    case "seleccionar":
      guardarDatos();
      ruta = "index.html";
      break;
    case "peliculas":
      guardarDatos();
      ruta = "peliculas.html";
      break;
    case "series":
      guardarDatos();
      ruta = "series.html";
      break;
    case "pelicula":
      guardarDatos();
      ruta = "pelicula.html";
      break;
    case "serie":
      guardarDatos();
      ruta = "serie.html";
      break;
    case "busqueda":
      guardarDatos();
      ruta = "busqueda.html";
      break;
  }
  if (ruta) {
    window.location.href = ruta;
  } else {
    console.error("No se definió una ruta para la selección.");
  }
}



function generarJSONInicio(lista, respuesta, tipo) {
  respuesta.forEach((titulo) => {
    const pelicula = {
      Nombre: titulo.title || titulo.name,
      Lanzamiento: titulo.release_date || titulo.first_air_date,
      Poster: titulo.poster_path,
      Id: titulo.id,
      Tipo: tipo,
    };
    lista.push(pelicula);
  });
}

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

function JSONserie(titulo, lista) {
  let resultado = [];
  const serie = {
    Nombre:
      titulo.title ||
      titulo.name ||
      titulo.original_title ||
      titulo.original.name,
    Lanzamiento: titulo.release_date || titulo.first_air_date,
    Poster: titulo.poster_path,
    Id: titulo.id,
    Tipo: "tv",
    Generos: titulo.genres?.map((genre) => genre.name).join(", ") || "",
    Status: titulo.status,
    Videos: titulo.videos?.results || [],
    Portada: titulo.backdrop_path,
    Creditos: titulo.credits?.cast || [],
    Proveedores:
      titulo["watch/providers"]?.results?.CO?.flatrate || "No disponible",
    Creador: titulo.created_by,
    Capitulos: titulo.number_of_episodes,
    Temporadas: titulo.number_of_seasons,
    Descripcion: titulo.overview,
    Season: titulo.seasons,
  };
  resultado.push(serie);
  lista = resultado;
  crearSerieDetalles(elementos.serie, lista);
  mostrarSoloElemento(elementos.serie);
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

function whatchlist(tipo, lista, elemento) {
  fetch(`https://api.themoviedb.org/3/account/21500820/watchlist/${tipo}`, get)
    .then((res) => res.json())
    .then((res) => {
      if (res.results) {
        const ids = res.results.map((item) => item.id);
        if (tipo === "tv") {
          generarJSONInicio(lista, res.results, "tv");
          crearlistaInicio(elemento, lista);
        } else {
          generarJSONInicio(lista, res.results, "movie");
          crearlistaInicio(elemento, lista);
        }
      } else {
        console.error("No se encontraron resultados");
      }
    })
    .catch((err) => console.error(err));
}

function generarPrincipal() {
  whatchlist("movies", todasLasPeliculas, elementos.peliculas);
  whatchlist("tv", todasLasSeries, elementos.series);
}

generarPrincipal();

dropdownMenu.addEventListener("change", manejarSeleccion);
boton.addEventListener("click", buscar);

document
  .querySelectorAll(
    '[data-name="busqueda"], [data-name="peliculas"], [data-name="series"], [data-name="pelicula"], [data-name="serie"]'
  )
  .forEach((contenedor) => {
    contenedor.addEventListener("click", function (event) {
      if (event.target.classList.contains("agregar-btn")) {
        let id = event.target.closest(".pelicula-container").id;
        let tipo = event.target
          .closest(".pelicula-container")
          .querySelector("#tipo").textContent;
        const body = {
          media_id: id,
          media_type: tipo,
          watchlist: true,
        };
        modificarWatchlist(body);
        if (tipo === "movie") {
        } else {
          todasLasSeries.push();
        }
      } else if (event.target.classList.contains("eliminar-btn")) {
        let id = event.target.closest(".pelicula-container").id;
        let tipo = event.target
          .closest(".pelicula-container")
          .querySelector("#tipo").textContent;
        const body = {
          media_id: id,
          media_type: tipo,
          watchlist: false,
        };
        modificarWatchlist(body);
        if (tipo === "movie") {
        } else {
          todasLasSeries.push();
        }
      }else if(event.target.classList.contains("completo")){
        console.log(todasLasPeliculas)
      }
    });
  });
