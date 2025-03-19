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

let todasLasPeliculas = new Set();
let todasLasSeries = new Set();
let peliculas = {};
let series = {};
let colecciones = {};
let data = {};

async function cargarDatosGuardados() {
  const datos = localStorage.getItem("datos");
  data = JSON.parse(datos);
  peliculas = data["peliculas"];
  series = data["series"];
  colecciones = data["colecciones"];
  todasLasPeliculas = new Set(data["peliculasCard"]);
  todasLasSeries = new Set(data["seriesCard"]);
}

await cargarDatosGuardados();

const busquedaInput = document.getElementById("search-input");
const boton = document.getElementById("search-button");
const dropdownMenu = document.getElementById("dropdown-menu");

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
    case "actualizar":
      ruta = "actualizar.html";
      break;
  }
  if (ruta) {
    window.location.href = ruta;
  } else {
    console.error("No se definió una ruta para la selección.");
  }
}

function JSONpelicula(titulo) {
  return {
    Generos: titulo.genres?.map((genre) => genre.name).join(", ") || "",
    Id: titulo.id,
    Nombre:
      titulo.title ||
      titulo.name ||
      titulo.original_title ||
      titulo.original_name,
    Coleccion: titulo.belongs_to_collection?.id || null,
    Descripcion:
      titulo.translations.translations
        .filter((item) => item.iso_639_1 === "es" && item.iso_3166_1 === "CO")
        .find((item) => item)?.data.overview ||
      titulo.translations.translations
        .filter((item) => item.iso_639_1 === "es" && item.iso_3166_1 === "MX")
        .find((item) => item)?.data.overview ||
      titulo.translations.translations
        .filter((item) => item.iso_639_1 === "es" && item.iso_3166_1 === "ES")
        .find((item) => item)?.data.overview ||
      titulo.overview ||
      null,
    Lanzamiento:
      titulo.release_date?.split(/[-/]/).find((part) => part.length === 4) ||
      "",
    Duracion: `${Math.floor(titulo.runtime / 60)}h ${titulo.runtime % 60}min`,
    Status: titulo.status || null,
    Tagline: titulo.tagline || null,
    Tipo: "movie",
    Poster:
      titulo.images?.posters
        .filter(
          (item) =>
            (item.iso_639_1 === "en" || item.iso_639_1 === null) &&
            item.height >= 1500 &&
            item.aspect_ratio === 0.667
        )
        .sort((a, b) => b.vote_average - a.vote_average)[0]?.file_path ||
      titulo.poster_path ||
      null,
    Portada:
      titulo.images?.backdrops
        .filter(
          (item) =>
            (item.iso_639_1 === "en" || item.iso_639_1 === null) &&
            item.height >= 1080 &&
            item.aspect_ratio === 1.778
        )
        .sort((a, b) => b.vote_average - a.vote_average)[0]?.file_path ||
      titulo.poster_path ||
      null,
    Logo:
      titulo.images?.logos
        .filter(
          (item) =>
            (item.iso_639_1 === "en" || item.iso_639_1 === null) &&
            item.width >= 400
        )
        .sort((a, b) => b.vote_average - a.vote_average)[0]?.file_path || null,
    Videos:
      titulo.videos?.results
        .filter((item) => item.type === "Trailer")
        .map((item) => item.key) || null,
    Reparto:
      titulo.credits?.cast
        .filter((item) => item.profile_path !== null)
        .slice(0, 15)
        .map((item) => {
          return {
            Nombre: item.name,
            Foto: item.profile_path,
            Personaje: item.character,
          };
        }) || null,
    Directores:
      titulo.credits?.crew
        .filter((item) => item.job === "Director" && item.profile_path !== null)
        .map((item) => {
          return {
            Nombre: item.name,
            Foto: item.profile_path,
          };
        }) || null,
    Proveedores:
      titulo["watch/providers"]?.results?.CO?.flatrate || "No disponible",
  };
}

function JSONserie(titulo) {
  return {
    Nombre:
      titulo.title ||
      titulo.name ||
      titulo.original_title ||
      titulo.original.name,
    Lanzamiento: titulo.first_air_date
      ? `${titulo.first_air_date.split(/[-/]/).find((p) => p.length === 4)}${
          titulo.status !== "Ended" && titulo.status !== "Canceled"
            ? " - Presente"
            : titulo.last_air_date
            ? ` - ${titulo.last_air_date
                .split(/[-/]/)
                .find((p) => p.length === 4)}`
            : ""
        }`
      : "Desconocido",
    Id: titulo.id,
    Tipo: "tv",
    Generos: titulo.genres?.map((genre) => genre.name).join(", ") || "",
    Status: titulo.status || null,
    Tagline: titulo.tagline || null,
    Videos:
      titulo.videos?.results
        .filter((item) => item.type === "Trailer")
        .map((item) => item.key) || null,
    Poster:
      titulo.images?.posters
        .filter(
          (item) =>
            (item.iso_639_1 === "en" || item.iso_639_1 === null) &&
            item.height >= 1500 &&
            item.aspect_ratio === 0.667
        )
        .sort((a, b) => b.vote_average - a.vote_average)[0]?.file_path ||
      titulo.poster_path ||
      null,
    Portada:
      titulo.images?.backdrops
        .filter(
          (item) =>
            (item.iso_639_1 === "en" || item.iso_639_1 === null) &&
            item.height >= 1080 &&
            item.aspect_ratio === 1.778
        )
        .sort((a, b) => b.vote_average - a.vote_average)[0]?.file_path ||
      titulo.poster_path ||
      null,
    Logo:
      titulo.images?.logos
        .filter(
          (item) =>
            (item.iso_639_1 === "en" || item.iso_639_1 === null) &&
            item.width >= 400
        )
        .sort((a, b) => b.vote_average - a.vote_average)[0]?.file_path || null,
    Directores:
      titulo.created_by
        .filter((item) => item.profile_path !== null)
        .map((item) => {
          return {
            Nombre: item.name,
            Foto: item.profile_path,
          };
        }) || null,
    Reparto:
      titulo.aggregate_credits?.cast
        .filter((item) => item.profile_path !== null)
        .slice(0, 15)
        .map((item) => {
          return {
            Nombre: item.name,
            Foto: item.profile_path,
            Personaje: item.roles.map((item) => item.character).join("<br>"),
          };
        }) || null,
    Proveedores:
      titulo["watch/providers"]?.results?.CO?.flatrate || "No disponible",
    Duracion: `${titulo.number_of_seasons} ${
      titulo.number_of_seasons === 1 ? "temporada" : "temporadas"
    } - ${titulo.number_of_episodes} capítulos`,
    Descripcion:
      titulo.translations.translations
        .filter((item) => item.iso_639_1 === "es" && item.iso_3166_1 === "CO")
        .find((item) => item)?.data.overview ||
      titulo.translations.translations
        .filter((item) => item.iso_639_1 === "es" && item.iso_3166_1 === "MX")
        .find((item) => item)?.data.overview ||
      titulo.translations.translations
        .filter((item) => item.iso_639_1 === "es" && item.iso_3166_1 === "ES")
        .find((item) => item)?.data.overview ||
      titulo.overview ||
      null,
    Temporadas: titulo.seasons
      .filter(
        (season) => season.name !== "Specials" && season.poster_path !== null
      )
      .map((season) => ({
        Nombre: season.name,
        Poster: season.poster_path,
        Duracion: `${season.episode_count} capitulos`,
        Lanzamiento:
          season.air_date?.split(/[-/]/).find((p) => p.length === 4) || "",
      })),
  };
}

function JSONcoleccion(data) {
  return {
    Nombre: data.original_name || data.name,
    Lanzamiento: (() => {
      let years = data.parts
        .map(
          (i) => i.release_date?.split(/[-/]/).find((p) => p.length === 4) || ""
        )
        .filter(Boolean)
        .sort((a, b) => a - b);

      return years.length
        ? `${years[0]} - ${
            data.parts.some((p) => !p.release_date)
              ? "Presente"
              : years[years.length - 1]
          }`
        : "Desconocido";
    })(),
    Poster:
      data.images?.posters
        .filter(
          (item) =>
            (item.iso_639_1 === "en" || item.iso_639_1 === null) &&
            item.height >= 1500 &&
            item.aspect_ratio === 0.667
        )
        .sort((a, b) => b.vote_average - a.vote_average)[0]?.file_path ||
      data.poster_path ||
      null,
    Portada:
      data.images?.backdrops
        .filter(
          (item) =>
            (item.iso_639_1 === "en" || item.iso_639_1 === null) &&
            item.height >= 1080 &&
            item.aspect_ratio === 1.778
        )
        .sort((a, b) => b.vote_average - a.vote_average)[0]?.file_path ||
      data.backdrop_path ||
      null,
    Id: data.id,
    Duracion: `${data.parts.length} películas`,
    Tipo: "collection",

    Descripcion:
      data.translations.translations
        .filter((item) => item.iso_639_1 === "es" && item.iso_3166_1 === "CO")
        .find((item) => item)?.data.overview ||
      data.translations.translations
        .filter((item) => item.iso_639_1 === "es" && item.iso_3166_1 === "MX")
        .find((item) => item)?.data.overview ||
      data.translations.translations
        .filter((item) => item.iso_639_1 === "es" && item.iso_3166_1 === "ES")
        .find((item) => item)?.data.overview ||
      data.overview ||
      null,
    Peliculas: data.parts
      .sort((a, b) => new Date(a.release_date) - new Date(b.release_date))
      .map((item) => item.id),
  };
}

async function buscarColeccion(query) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/collection?query=${query}`,
      get
    );

    if (!res.ok) {
      throw new Error(`Error al realizar la solicitud: ${res.status}`);
    }

    const data = await res.json();
    if (data) {
      colecciones[data.id] = JSONcoleccion(data);
    }
  } catch (err) {
    console.error("Error al cargar datos:", err);
  }
}

function guardarDatos() {
  localStorage.setItem("datos", JSON.stringify(data));
}

await cargarDatos("movies");
await cargarDatos("tv");
for (const id in peliculas) {
  if (peliculas[id].Coleccion) {
    todasLasPeliculas.add(colecciones[peliculas[id].Coleccion]);
  } else {
    todasLasPeliculas.add(peliculas[id]);
  }
}

data["peliculas"] = peliculas;
data["series"] = series;
data["colecciones"] = colecciones;
data["peliculasCard"] = [...todasLasPeliculas];
data["seriesCard"] = [...todasLasSeries];

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
  fetch(`https://api.themoviedb.org/3/search/multi?query=${query}`, get)
    .then((res) => res.json())
    .then((res) => {
      if (res.results) {
        console.log(res.results);

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
