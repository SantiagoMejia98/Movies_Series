const get = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMGUxNDBmYzcyNGQ1OTFjMzAwMWJlNDQ4NDg4MjcxMiIsIm5iZiI6MTcyNTQ3NzAyMS40NzcsInN1YiI6IjY2ZDhiMDlkM2E5NGE0OWMxNjI2ZjAzZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.RdYktkxjOZERUNw2BaaX_ew5YAGVx2pJzAy5kHzi3RI",
  },
};
const PROVEEDORES_VALIDOS = [
  "Disney Plus",
  "Amazon Prime Video",
  "Netflix",
  "Apple TV Plus",
  "Max",
  "Paramount Plus",
  "Crunchyroll",
  "Universal+ Amazon Channel",
];

const EXPIRATION_DAYS = 30;

const dropdownMenu = document.getElementById("dropdown-menu");

let todasLasPeliculas = new Set();
let todasLasSeries = new Set();
let peliculas = {};
let series = {};
let colecciones = {};
let data = {};

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
    Nombre: `${titulo.title || titulo.name}${
      titulo.original_name &&
      titulo.original_name !== titulo.title &&
      titulo.original_name !== titulo.name
        ? ` (${titulo.original_name})`
        : titulo.original_title &&
          titulo.original_title !== titulo.title &&
          titulo.original_title !== titulo.name
        ? ` (${titulo.original_title})`
        : ""
    }`,
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
      "9999",
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
      titulo.backdrop_path ||
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
            Personaje: item.character.split("(")[0],
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
      titulo["watch/providers"]?.results?.CO?.flatrate
        ?.filter((prov) => PROVEEDORES_VALIDOS.includes(prov.provider_name))
        .map((item) => {
          return {
            Logo: item.logo_path,
            Nombre: item.provider_name,
          };
        }) || [],
  };
}

function JSONserie(titulo) {
  return {
    Nombre: `${titulo.title || titulo.name}${
      titulo.original_name &&
      titulo.original_name !== titulo.title &&
      titulo.original_name !== titulo.name
        ? ` (${titulo.original_name})`
        : titulo.original_title &&
          titulo.original_title !== titulo.title &&
          titulo.original_title !== titulo.name
        ? ` (${titulo.original_title})`
        : ""
    }`,
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
      titulo.backdrop_path ||
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
            Personaje: item.roles[0].character.split("/")[0].split("(")[0],
          };
        }) || null,
    Proveedores:
      titulo["watch/providers"]?.results?.CO?.flatrate
        ?.filter((prov) => PROVEEDORES_VALIDOS.includes(prov.provider_name))
        .map((item) => {
          return {
            Logo: item.logo_path,
            Nombre: item.provider_name,
          };
        }) || [],
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
          season.air_date?.split(/[-/]/).find((p) => p.length === 4) || "9999",
      })),
  };
}

function JSONcoleccion(data) {
  return {
    Nombre: `${data.title || data.name} ${
      data.original_name
        ? `(${data.original_name})`
        : "" || data.original_title
        ? `(${data.original_title})`
        : ""
    }`,
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
      data.poster_path?.poster_path ||
      data.parts.filter((item) => item.poster_path !== null)[0]?.poster_path ||
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
      data.backdrop_path?.backdrop_path ||
      data.parts.filter((item) => item.backdrop_path !== null)[0]
        ?.backdrop_path ||
      data.poster_path ||
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
      .filter((item) => item.poster_path !== null)
      .sort((a, b) => new Date(a.release_date) - new Date(b.release_date))
      .map((item) => item.id),
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
            await buscarDetallesSeries(titulo.id);
          });

          await Promise.all(detalles);
        } else {
          const detalles = data.results.map(async (titulo) => {
            await buscarDetallesPeliculas(titulo.id);
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

async function buscarDetallesPeliculas(id) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?append_to_response=credits,videos,watch/providers,translations,images`,
      get
    );

    if (!res.ok) {
      throw new Error(`Error al realizar la solicitud: ${res.status}`);
    }

    const data = await res.json();
    if (data) {
      peliculas[id] = JSONpelicula(data);
      if (data.belongs_to_collection) {
        if (!colecciones[data.belongs_to_collection.id]) {
          await buscarColeccion(data.belongs_to_collection.id);
        }
      }
    }
  } catch (err) {
    console.error("Error al cargar datos:", err);
  }
}

async function buscarDetallesSeries(id) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/${id}?append_to_response=aggregate_credits,videos,watch/providers,translations,images`,
      get
    );

    if (!res.ok) {
      throw new Error(`Error al realizar la solicitud: ${res.status}`);
    }

    const data = await res.json();
    if (data) {
      series[id] = JSONserie(data);
      todasLasSeries.add(series[id]);
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
      for (const pelicula of data.parts) {
        if (!peliculas[pelicula.id]) {
          await buscarDetallesPeliculas(pelicula.id);
        }
      }
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
const expirationDate = new Date();
expirationDate.setDate(expirationDate.getDate() + EXPIRATION_DAYS);
data["expirationDate"] = expirationDate;

alert(
  Object.keys(peliculas).length +
    "\n" +
    Object.keys(series).length +
    "\n" +
    Object.keys(colecciones).length +
    "\n" +
    todasLasPeliculas.size +
    "\n" +
    todasLasSeries.size
);

guardarDatos();
window.location = "index.html";
