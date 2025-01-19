const elementos = {
  busqueda: document.querySelector('[data-name="busqueda"]'),
  peliculas_presentes: document.querySelector(
    '[data-name="peliculas_presentes"]'
  ),
  series_presentes: document.querySelector('[data-name="series_presentes"]'),
  peliculas_nuevas: document.querySelector('[data-name="peliculas_nuevas"]'),
  series_nuevas: document.querySelector('[data-name="series_nuevas"]'),
};

const get = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMGUxNDBmYzcyNGQ1OTFjMzAwMWJlNDQ4NDg4MjcxMiIsIm5iZiI6MTcyNTQ3NzAyMS40NzcsInN1YiI6IjY2ZDhiMDlkM2E5NGE0OWMxNjI2ZjAzZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.RdYktkxjOZERUNw2BaaX_ew5YAGVx2pJzAy5kHzi3RI",
  },
};

const busquedaInput = document.getElementById("search-input");
const boton = document.getElementById("search-button");
const dropdownMenu = document.getElementById("dropdown-menu");

let todasLasPeliculas = [];
let todasLasSeries = [];

function crearListaBusquedaPresente(elemento, datos) {
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

function crearListaBusqueda(elemento, datos) {
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
                      <button class="agregar-btn">Agregar</button>
                  </div>
              </div>
          `;

    ul.appendChild(li);
  });

  elemento.appendChild(ul);
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

function cargarDatos(tipo, lista) {
  fetch(`https://api.themoviedb.org/3/account/21500820/watchlist/${tipo}`, get)
    .then((res) => res.json())
    .then((res) => {
      if (res.results) {
        if (tipo === "tv") {
          generarJSONInicio(lista, res.results, "tv");
        } else {
          generarJSONInicio(lista, res.results, "movie");
        }
      } else {
        console.error("No se encontraron resultados");
      }
    })
    .catch((err) => console.error(err));
}

cargarDatos("tv", todasLasSeries);
cargarDatos("movies", todasLasPeliculas);

function generarJSONBusqueda(lista, respuesta) {
  respuesta.forEach((titulo) => {
    const pelicula = {
      Nombre: titulo.title || titulo.name,
      Lanzamiento: titulo.release_date || titulo.first_air_date,
      Poster: titulo.poster_path,
      Id: titulo.id,
      Tipo: titulo.media_type,
    };
    lista.push(pelicula);
  });
}

function buscarAgregados(respuesta, lista) {
  const resultados = lista.filter((item) => respuesta.includes(item.Id));
  return resultados;
}

function buscar() {
  const query = document.getElementById("search-input").value;
  document.getElementById("search-input").value = "";
  nuevaBusqueda(query);
}

function nuevaBusqueda(query) {
  fetch(
    `https://api.themoviedb.org/3/search/multi?include_adult=false&query=${query}`,
    get
  )
    .then((res) => res.json())
    .then((res) => {
      if (res.results) {
        const peliculas = res.results
          .filter((item) => item.media_type === "movie")
          .map((item) => item.id);
        const series = res.results
          .filter((item) => item.media_type === "tv")
          .map((item) => item.id);

        let resultadosPeliculas = buscarAgregados(peliculas, todasLasPeliculas);
        let resultadosSeries = buscarAgregados(series, todasLasSeries);

        const peliculasIds = resultadosPeliculas.map((titulo) => titulo.Id);
        const seriesIds = resultadosSeries.map((titulo) => titulo.Id);

        const peliculasRespuesta = res.results
          .filter(
            (item) =>
              item.media_type === "movie" &&
              !peliculasIds.includes(item.id) &&
              item.poster_path != null
          )
          .map((item) => item);
        const seriesRespuesta = res.results
          .filter(
            (item) =>
              item.media_type === "tv" &&
              !seriesIds.includes(item.id) &&
              item.poster_path != null
          )
          .map((item) => item);

        let peliculasNuevas = [];
        let seriesNuevas = [];
        generarJSONBusqueda(peliculasNuevas, peliculasRespuesta);
        generarJSONBusqueda(seriesNuevas, seriesRespuesta);

        if (resultadosPeliculas.length > 0) {
          elementos.peliculas_presentes.classList.remove("hidden");
          crearListaBusquedaPresente(
            elementos.peliculas_presentes,
            resultadosPeliculas
          );
        } else {
          elementos.peliculas_presentes.classList.add("hidden");
        }

        if (resultadosSeries.length > 0) {
          elementos.series_presentes.classList.remove("hidden");
          crearListaBusquedaPresente(
            elementos.series_presentes,
            resultadosSeries
          );
        } else {
          elementos.series_presentes.classList.add("hidden");
        }

        if (peliculasNuevas.length > 0) {
          elementos.peliculas_nuevas.classList.remove("hidden");
          crearListaBusqueda(elementos.peliculas_nuevas, peliculasNuevas);
        } else {
          elementos.peliculas_nuevas.classList.add("hidden");
        }

        if (seriesNuevas.length > 0) {
          elementos.series_nuevas.classList.remove("hidden");
          crearListaBusqueda(elementos.series_nuevas, seriesNuevas);
        } else {
          elementos.series_nuevas.classList.add("hidden");
        }
      } else {
        console.error("No se encontraron resultados");
      }
    })
    .catch((err) => console.error(err));
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

function modificarWatchlist(body) {
  const post = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMGUxNDBmYzcyNGQ1OTFjMzAwMWJlNDQ4NDg4MjcxMiIsIm5iZiI6MTcyNTQ3NzAyMS40NzcsInN1YiI6IjY2ZDhiMDlkM2E5NGE0OWMxNjI2ZjAzZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.RdYktkxjOZERUNw2BaaX_ew5YAGVx2pJzAy5kHzi3RI",
    },
    body: JSON.stringify(body),
  };

  fetch("https://api.themoviedb.org/3/account/21500820/watchlist", post)
    .then((res) => res.json())
    .then((res) => console.log(res))
    .catch((err) => console.error(err));
  //location.reload()
}
function buscarDetalles(body, id) {
  fetch(`https://api.themoviedb.org/3/movie/${id}`, get)
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      if (res.belongs_to_collection) {
        console.log(res.belongs_to_collection.id);
        let coleccion = res.belongs_to_collection.id;
        buscarColeccion(coleccion);
      } else {
        modificarWatchlist(body);
      }
    })
    .catch((err) => {
      console.error(err);
    });
}

function buscarColeccion(id) {
  fetch(`https://api.themoviedb.org/3/collection/${id}`, get)
    .then((res) => res.json())
    .then((res) => {
      res.parts.forEach((titulo) => {
        console.log(res.parts);
        const body = {
          media_id: titulo.id,
          media_type: "movie",
          watchlist: true,
        };
        modificarWatchlist(body);
      });
    })
    .catch((err) => console.error(err));
}

document.querySelectorAll('[data-name="busqueda"]').forEach((contenedor) => {
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
      buscarDetalles(body, id);
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
    }
  });
});

dropdownMenu.addEventListener("change", manejarSeleccion);
boton.addEventListener("click", buscar);
