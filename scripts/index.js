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

const EXPIRATION_DAYS = 7;

const dropdownMenu = document.getElementById("dropdown-menu");

let todasLasPeliculas = new Set();
let todasLasSeries = new Set();
let peliculas = {};
let series = {};
let colecciones = {};
let data = {};

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
                        <p class="fecha">${pelicula.Lanzamiento}</p>
                        <p class="duracion">${pelicula.Duracion}</p>
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
    Director: titulo.created_by,
    Duracion: `${titulo.number_of_seasons} ${
      titulo.number_of_seasons === 1 ? "temporada" : "temporadas"
    }<br>${titulo.number_of_episodes} capítulos`,
    Descripcion: titulo.overview,
    Season: titulo.seasons,
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
          const detalles = data.results.map(async (titulo) => {
            await buscarDetalles(titulo.id, "tv");
          });

          await Promise.all(detalles);
        } else {
          const detalles = data.results.map(async (titulo) => {
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
        todasLasSeries.add(series[id]);
      } else {
        peliculas[id] = JSONpelicula(data);
        if (data.belongs_to_collection) {
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
      colecciones[data.id] = JSONcoleccion(data);
    }
  } catch (err) {
    console.error("Error al cargar datos:", err);
  }
}
function guardarDatos() {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + EXPIRATION_DAYS);
  data["expirationDate"] = expirationDate;
  localStorage.setItem("datos", JSON.stringify(data));
}

async function cargarDatosGuardados() {
  const datos = localStorage.getItem("datos");
  if (datos && new Date(JSON.parse(datos)["expirationDate"]) > new Date()) {
    data = JSON.parse(datos);
    console.log(data);
    peliculas = data["peliculas"];
    series = data["series"];
    colecciones = data["colecciones"];
    todasLasPeliculas = new Set(data["peliculasCard"]);
    todasLasSeries = new Set(data["seriesCard"]);
  } else {
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

    guardarDatos();
  }
}

await cargarDatosGuardados();

crearlistaInicio(elementos.peliculas, todasLasPeliculas);
crearlistaInicio(elementos.series, todasLasSeries);

dropdownMenu.addEventListener("change", manejarSeleccion);
