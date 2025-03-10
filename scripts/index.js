const elementos = {
  peliculas: document.querySelector('[data-name="peliculas"]'),
  series: document.querySelector('[data-name="series"]'),
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
let peliculasID = [];
let seriesID = [];
let peliculas = {};
let series = {};
let colecciones = {};
let coleccionId = new Set();

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
                    <img src="https://image.tmdb.org/t/p/original${pelicula.Poster[0]}" alt="${pelicula.Nombre}">
                    <div class="informacion">
                        <p class="fecha"><strong></strong> ${pelicula.Lanzamiento}</p>
                        <p class="hidden" id="tipo">${pelicula.Tipo}</p>
                    </div>
                </div>
            `;

    ul.appendChild(li);
  });

  elemento.appendChild(ul);
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
      "No hay fecha de estreno",
    Duracion: `${Math.floor(titulo.runtime / 60)}h ${titulo.runtime % 60}min`,
    Status: titulo.status || null,
    Tagline: titulo.tagline || null,
    Poster:
      titulo.images?.posters
        .filter(
          (item) =>
            (item.iso_639_1 === "en" || item.iso_639_1 === null) &&
            item.height >= 1500 &&
            item.aspect_ratio === 0.667
        )
        .sort((a, b) => b.vote_average - a.vote_average)
        .map((item) => item.file_path) ||
      titulo.poster_path ||
      null,
    Videos:
      titulo.videos?.results
        .filter((item) => item.type === "Trailer")
        .map((item) => item.key) || null,
    Portada:
      titulo.images?.backdrops
        .filter(
          (item) =>
            (item.iso_639_1 === "en" || item.iso_639_1 === null) &&
            item.height >= 1080 &&
            item.aspect_ratio === 1.778
        )
        .sort((a, b) => b.vote_average - a.vote_average)
        .map((item) => item.file_path) ||
      titulo.poster_path ||
      null,
    Logo:
      titulo.images?.logos
        .filter(
          (item) =>
            (item.iso_639_1 === "en" || item.iso_639_1 === null) &&
            item.width >= 400
        )
        .sort((a, b) => b.vote_average - a.vote_average)
        .map((item) => item.file_path) || null,
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
        .filter((item) => item.job === "Director")
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

function JSONcoleccion(data) {
  return {
    Nombre: data.original_name || data.name,
    Lanzamiento: (() => {
      let y = data.parts
        .map(
          (i) => i.release_date?.split(/[-/]/).find((p) => p.length === 4) || ""
        )
        .filter(Boolean)
        .sort((a, b) => a - b);
      return y.length
        ? `${y[0]} - ${y[y.length - 1] ? y[y.length - 1] : "Presente"}`
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
        .sort((a, b) => b.vote_average - a.vote_average)
        .map((item) => item.file_path) ||
      data.poster_path ||
      null,
    Id: data.id,
    Duracion: `${data.parts.length} películas`,
    Portada:
      data.images?.backdrops
        .filter(
          (item) =>
            (item.iso_639_1 === "en" || item.iso_639_1 === null) &&
            item.height >= 1080 &&
            item.aspect_ratio === 1.778
        )
        .sort((a, b) => b.vote_average - a.vote_average)
        .map((item) => item.file_path) ||
      data.backdrop_path ||
      null,
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

function JSONserie(titulo) {
  return {
    Nombre:
      titulo.title ||
      titulo.name ||
      titulo.original_title ||
      titulo.original.name,
    Lanzamiento: titulo.first_air_date
      ? `${titulo.first_air_date.split(/[-/]/).find((p) => p.length === 4)} - ${
          titulo.last_air_date?.split(/[-/]/).find((p) => p.length === 4) ||
          "Presente"
        }`
      : "Desconocido",
    Poster:
      titulo.images?.posters
        .filter(
          (item) =>
            (item.iso_639_1 === "en" || item.iso_639_1 === null) &&
            item.height >= 1500 &&
            item.aspect_ratio === 0.667
        )
        .sort((a, b) => b.vote_average - a.vote_average)
        .map((item) => item.file_path) ||
      titulo.poster_path ||
      null,
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
}

function generarJSONInicio(titulo, tipo) {
  return {
    Nombre:
      titulo.title ||
      titulo.name ||
      titulo.original_title ||
      titulo.original_name,
    Lanzamiento:
      titulo.release_date?.split(/[-/]/).find((part) => part.length === 4) ||
      titulo.first_air_date?.split(/[-/]/).find((part) => part.length === 4) ||
      "No hay fecha de estreno",
    Poster: titulo.poster_path || null,
    Id: titulo.id,
    Tipo: tipo,
  };
}

async function cargarDatos(tipo) {
  try {
    let page = 1;
    let totalPages;

    do {
      const res = await fetch(
        `https://api.themoviedb.org/3/account/21500820/watchlist/${tipo}?page=${page}`,
        get
      );

      if (!res.ok) {
        throw new Error(`Error al realizar la solicitud: ${res.status}`);
      }

      const data = await res.json();

      if (data.results) {
        if (tipo === "tv") {
          seriesID = [...seriesID, ...data.results.map((item) => item.id)];

          const detalles = data.results.map(async (titulo) => {
            const jsonSerie = generarJSONInicio(titulo, "tv");
            //todasLasSeries.push(jsonSerie);
            //crearlistaInicio(elementos.series, todasLasSeries);
            await buscarDetalles(titulo.id, "tv");
          });

          await Promise.all(detalles);
        } else {
          peliculasID = [
            ...peliculasID,
            ...data.results.map((item) => item.id),
          ];

          const detalles = data.results.map(async (titulo) => {
            const jsonPelicula = generarJSONInicio(titulo, "movie");
            //todasLasPeliculas.push(jsonPelicula);
            //crearlistaInicio(elementos.peliculas, todasLasPeliculas);
            await buscarDetalles(titulo.id, "movie");
          });

          await Promise.all(detalles);
        }
        totalPages = data.total_pages;
      } else {
        console.error("No se encontraron resultados");
        break;
      }

      page++;
    } while (page <= totalPages);
  } catch (err) {
    console.error("Error al cargar datos:", err);
  }
}

async function buscarDetalles(id, tipo) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/${tipo}/${id}?append_to_response=credits,videos,watch/providers,translations,images`,
      get
    );

    if (!res.ok) {
      throw new Error(`Error al realizar la solicitud: ${res.status}`);
    }

    const data = await res.json();
    if (data) {
      if (tipo === "tv") {
        series[id] = JSONserie(data);
        todasLasSeries.push(series[id]);
      } else {
        peliculas[id] = JSONpelicula(data);
        if (data.belongs_to_collection) {
          coleccionId.add(data.belongs_to_collection.id);
          if (!colecciones[data.belongs_to_collection.id]) {
            await buscarColeccion(data.belongs_to_collection.id);
          }
        }
      }
    }
  } catch (err) {
    console.error("Error al cargar datos:", err);
  }
}

async function buscarColeccion(id) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/collection/${id}?append_to_response=translations,images`,
      get
    );

    if (!res.ok) {
      throw new Error(`Error al realizar la solicitud: ${res.status}`);
    }

    const data = await res.json();
    if (data) {
      coleccionId.add(data.id);
      colecciones[data.id] = JSONcoleccion(data);
    }
  } catch (err) {
    console.error("Error al cargar datos:", err);
  }
}

await cargarDatos("movies");
await cargarDatos("tv");

console.log(peliculasID);
console.log(peliculas);
console.log(Object.keys(peliculas).length);
console.log(coleccionId);
console.log(colecciones);
console.log(Object.keys(colecciones).length);
console.log(seriesID);
console.log(series);
console.log(Object.keys(series).length);

for (const id in colecciones) {
  todasLasPeliculas.push(colecciones[id]);
}

for (const id in peliculas) {
  if (!peliculas[id].Coleccion) {
    todasLasPeliculas.push(peliculas[id]);
  }
}

console.log(todasLasPeliculas);
console.log(todasLasSeries);

crearlistaInicio(elementos.peliculas, todasLasPeliculas);
crearlistaInicio(elementos.series, todasLasSeries);

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
      } else if (event.target.classList.contains("completo")) {
        console.log(todasLasPeliculas);
      }
    });
  });
