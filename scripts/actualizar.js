const get = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMGUxNDBmYzcyNGQ1OTFjMzAwMWJlNDQ4NDg4MjcxMiIsIm5iZiI6MTcyNTQ3NzAyMS40NzcsInN1YiI6IjY2ZDhiMDlkM2E5NGE0OWMxNjI2ZjAzZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.RdYktkxjOZERUNw2BaaX_ew5YAGVx2pJzAy5kHzi3RI",
  },
};
const INCLUIDOS = [8, 119, 337, 1899, 350, 531, 283, 339];

const EXPIRATION_DAYS = 30;

const dropdownMenu = document.getElementById("dropdown-menu");

let todasLasPeliculas = {};
let todasLasSeries = {};
let peliculas = {};
let colecciones = {};
let data = {};
let seriesId = new Set();
let peliculasId = {};
let coleccionesId = {};
let actores = {};
let directores = {};
let generos = {};
let proveedores = {};

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
    Generos:
      titulo.genres?.map((genre) => {
        generos[genre.id] = genre.name;
        return genre.id;
      }) || [],
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
      (
        titulo.translations.translations.find(
          (item) =>
            item.iso_639_1 === "es" &&
            item.iso_3166_1 === "MX" &&
            item.data?.overview?.trim()
        ) ||
        titulo.translations.translations.find(
          (item) =>
            item.iso_639_1 === "es" &&
            item.iso_3166_1 === "ES" &&
            item.data?.overview?.trim()
        )
      )?.data.overview ||
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
      titulo.images?.posters.filter(
        (item) =>
          (item.iso_639_1 === "en" || item.iso_639_1 === null) &&
          item.height >= 1500 &&
          item.aspect_ratio === 0.667
      )[0]?.file_path ||
      titulo.poster_path ||
      null,
    Portada:
      titulo.images?.backdrops.filter(
        (item) =>
          (item.iso_639_1 === "en" || item.iso_639_1 === null) &&
          item.height >= 1080 &&
          item.aspect_ratio === 1.778
      )[0]?.file_path ||
      titulo.backdrop_path ||
      titulo.poster_path ||
      null,
    Movil:
      titulo.images?.posters.filter(
        (item) =>
          (item.iso_639_1 === "en" || item.iso_639_1 === null) &&
          item.height >= 1500 &&
          item.aspect_ratio === 0.667
      )[1]?.file_path ||
      titulo.poster_path ||
      null,
    Logo:
      titulo.images?.logos.filter(
        (item) =>
          (item.iso_639_1 === "en" || item.iso_639_1 === null) &&
          item.width >= 400
      )[0]?.file_path || null,
    Reparto:
      titulo.credits?.cast
        .filter((item) => item.profile_path !== null)
        .slice(0, 15)
        .map((item) => {
          actores[item.id] = {
            Nombre: item.name,
            Foto: item.profile_path,
          };
          return item.id;
        }) || null,
    Directores:
      titulo.credits?.crew
        .filter((item) => item.job === "Director" && item.profile_path !== null)
        .map((item) => {
          directores[item.id] = {
            Nombre: item.name,
            Foto: item.profile_path,
          };
          return item.id;
        }) || null,
    Proveedores:
      titulo["watch/providers"]?.results?.CO?.flatrate
        ?.filter((item) => INCLUIDOS.includes(item.provider_id))
        .map((item) => {
          proveedores[item.provider_id] = {
            Nombre: item.provider_name,
            Logo: item.logo_path,
          };
          return item.provider_id;
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
            : titulo.last_air_date &&
              titulo.last_air_date.split(/[-/]/).find((p) => p.length === 4) !==
                titulo.first_air_date.split(/[-/]/).find((p) => p.length === 4)
            ? ` - ${titulo.last_air_date
                .split(/[-/]/)
                .find((p) => p.length === 4)}`
            : ""
        }`
      : "Desconocido",
    Id: titulo.id,
    Tipo: "tv",
    Generos:
      titulo.genres?.map((genre) => {
        generos[genre.id] = genre.name;
        return genre.id;
      }) || [],
    Status: titulo.status || null,
    Tagline: titulo.tagline || null,
    Poster:
      titulo.images?.posters.filter(
        (item) =>
          (item.iso_639_1 === "en" || item.iso_639_1 === null) &&
          item.height >= 1500 &&
          item.aspect_ratio === 0.667
      )[0]?.file_path ||
      titulo.poster_path ||
      null,
    Portada:
      titulo.images?.backdrops.filter(
        (item) =>
          (item.iso_639_1 === "en" || item.iso_639_1 === null) &&
          item.height >= 1080 &&
          item.aspect_ratio === 1.778
      )[0]?.file_path ||
      titulo.backdrop_path ||
      titulo.poster_path ||
      null,
    Movil:
      titulo.images?.posters.filter(
        (item) =>
          (item.iso_639_1 === "en" || item.iso_639_1 === null) &&
          item.height >= 1500 &&
          item.aspect_ratio === 0.667
      )[1]?.file_path ||
      titulo.poster_path ||
      null,
    Logo:
      titulo.images?.logos.filter(
        (item) =>
          (item.iso_639_1 === "en" || item.iso_639_1 === null) &&
          item.width >= 400
      )[0]?.file_path || null,
    Directores:
      titulo.created_by
        .filter((item) => item.profile_path !== null)
        .map((item) => {
          directores[item.id] = {
            Nombre: item.name,
            Foto: item.profile_path,
          };
          return item.id;
        }) || null,
    Reparto:
      titulo.aggregate_credits?.cast
        .filter((item) => item.profile_path !== null)
        .slice(0, 15)
        .map((item) => {
          actores[item.id] = {
            Nombre: item.name,
            Foto: item.profile_path,
          };
          return item.id;
        }) || null,
    Proveedores:
      titulo["watch/providers"]?.results?.CO?.flatrate
        ?.filter((item) => INCLUIDOS.includes(item.provider_id))
        .map((item) => {
          proveedores[item.provider_id] = {
            Nombre: item.provider_name,
            Logo: item.logo_path,
          };
          return item.provider_id;
        }) || [],
    Duracion: `${titulo.number_of_seasons} ${
      titulo.number_of_seasons === 1 ? "temporada" : "temporadas"
    } - ${titulo.number_of_episodes} capítulos`,
    Descripcion:
      (
        titulo.translations.translations.find(
          (item) =>
            item.iso_639_1 === "es" &&
            item.iso_3166_1 === "MX" &&
            item.data?.overview?.trim()
        ) ||
        titulo.translations.translations.find(
          (item) =>
            item.iso_639_1 === "es" &&
            item.iso_3166_1 === "ES" &&
            item.data?.overview?.trim()
        )
      )?.data.overview ||
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

function JSONcoleccion(titulo) {
  return {
    Nombre: `${titulo.title || titulo.name} ${
      titulo.original_name
        ? `(${titulo.original_name})`
        : "" || titulo.original_title
        ? `(${titulo.original_title})`
        : ""
    }`,
    Lanzamiento: (() => {
      let years = titulo.parts
        .map(
          (i) => i.release_date?.split(/[-/]/).find((p) => p.length === 4) || ""
        )
        .filter(Boolean)
        .sort((a, b) => a - b);

      return years.length
        ? `${years[0]} - ${
            titulo.parts.some((p) => !p.release_date)
              ? "Presente"
              : years[years.length - 1]
          }`
        : "Desconocido";
    })(),
    Poster:
      titulo.images?.posters.filter(
        (item) =>
          (item.iso_639_1 === "en" || item.iso_639_1 === null) &&
          item.height >= 1500 &&
          item.aspect_ratio === 0.667
      )[0]?.file_path ||
      titulo.poster_path?.poster_path ||
      titulo.parts.filter((item) => item.poster_path !== null)[0]
        ?.poster_path ||
      null,
    Portada:
      titulo.images?.backdrops.filter(
        (item) =>
          (item.iso_639_1 === "en" || item.iso_639_1 === null) &&
          item.height >= 1080 &&
          item.aspect_ratio === 1.778
      )[0]?.file_path ||
      titulo.backdrop_path?.backdrop_path ||
      titulo.parts.filter((item) => item.backdrop_path !== null)[0]
        ?.backdrop_path ||
      titulo.poster_path ||
      null,
    Movil:
      titulo.images?.posters.filter(
        (item) =>
          (item.iso_639_1 === "en" || item.iso_639_1 === null) &&
          item.height >= 1500 &&
          item.aspect_ratio === 0.667
      )[1]?.file_path ||
      titulo.poster_path?.poster_path ||
      titulo.parts.filter((item) => item.poster_path !== null)[1]
        ?.poster_path ||
      null,
    Id: titulo.id,
    Duracion: `${titulo.parts.length} películas`,
    Tipo: "collection",
    Descripcion:
      (
        titulo.translations.translations.find(
          (item) =>
            item.iso_639_1 === "es" &&
            item.iso_3166_1 === "MX" &&
            item.data?.overview?.trim()
        ) ||
        titulo.translations.translations.find(
          (item) =>
            item.iso_639_1 === "es" &&
            item.iso_3166_1 === "ES" &&
            item.data?.overview?.trim()
        )
      )?.data.overview ||
      titulo.overview ||
      null,
    Partes: titulo.parts
      .filter((item) => item.poster_path !== null)
      .sort((a, b) => new Date(a.release_date) - new Date(b.release_date))
      .map((item) => item.id),
    Peliculas: {},
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
      `https://api.themoviedb.org/3/movie/${id}?append_to_response=credits,watch/providers,translations,images`,
      get
    );

    if (!res.ok) {
      throw new Error(`Error al realizar la solicitud: ${res.status}`);
    }

    const data = await res.json();
    if (data) {
      peliculas[id] = JSONpelicula(data);
      if (data.belongs_to_collection) {
        peliculasId[id] = data.belongs_to_collection.id;
        if (!colecciones[data.belongs_to_collection.id]) {
          await buscarColeccion(data.belongs_to_collection.id);
        }
      } else {
        peliculasId[id] = null;
        todasLasPeliculas[id] = peliculas[id];
      }
    }
  } catch (err) {
    console.error("Error al cargar datos:", err);
  }
}

async function buscarDetallesSeries(id) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/${id}?append_to_response=aggregate_credits,watch/providers,translations,images`,
      get
    );

    if (!res.ok) {
      throw new Error(`Error al realizar la solicitud: ${res.status}`);
    }

    const data = await res.json();
    if (data) {
      todasLasSeries[id] = JSONserie(data);
      seriesId.add(id);
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
      colecciones[id] = JSONcoleccion(data);
      const partes = data.parts.map((item) => item.id);
      coleccionesId[id] = partes;

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

function guardarDatos(data) {
  localStorage.clear();
  localStorage.setItem("peliculasCard", JSON.stringify(data["peliculasCard"]));
  localStorage.setItem("seriesCard", JSON.stringify(data["seriesCard"]));
  localStorage.setItem("peliculasId", JSON.stringify(data["peliculasId"]));
  localStorage.setItem("seriesId", JSON.stringify(data["seriesId"]));
  localStorage.setItem("coleccionesId", JSON.stringify(data["coleccionesId"]));
  localStorage.setItem("actores", JSON.stringify(data["actores"]));
  localStorage.setItem("directores", JSON.stringify(data["directores"]));
  localStorage.setItem("generos", JSON.stringify(data["generos"]));
  localStorage.setItem("proveedores", JSON.stringify(data["proveedores"]));
  localStorage.setItem(
    "expirationDate",
    JSON.stringify(data["expirationDate"])
  );
}

await cargarDatos("movies");
await cargarDatos("tv");

for (const coleccion in colecciones) {
  let generosColeccion = new Set();
  let proveedoresColeccion = new Set();
  for (const movieId of colecciones[coleccion].Partes) {
    colecciones[coleccion].Peliculas[movieId] = peliculas[movieId];
    let genero = peliculas[movieId].Generos;
    let proveedor = peliculas[movieId].Proveedores;
    genero.forEach((g) => {
      generosColeccion.add(g);
    });
    proveedor.forEach((p) => {
      {
        proveedoresColeccion.add(p);
      }
    });
  }
  colecciones[coleccion].Generos = Array.from(generosColeccion);
  colecciones[coleccion].Proveedores = Array.from(proveedoresColeccion);
  todasLasPeliculas[coleccion] = colecciones[coleccion];
}

data["peliculasCard"] = todasLasPeliculas;
data["seriesCard"] = todasLasSeries;
data["peliculasId"] = peliculasId;
data["seriesId"] = Array.from(seriesId);
data["coleccionesId"] = coleccionesId;
const expirationDate = new Date();
expirationDate.setDate(expirationDate.getDate() + EXPIRATION_DAYS);
data["expirationDate"] = expirationDate;
data["actores"] = actores;
data["directores"] = directores;
data["generos"] = generos;
data["proveedores"] = proveedores;

function getSizeInMB(str) {
  const bytes = new Blob([str]).size;
  return (bytes / (1024 * 1024)).toFixed(3); // Redondeado a 3 decimales
}

function medirPesos(data) {
  const jsonString = JSON.stringify(data);
  const compressed = LZString.compressToUTF16(jsonString);

  alert(
    "Tamaño JSON.stringify: " +
      getSizeInMB(jsonString) +
      " MB\n" +
      "Tamaño LZString.compressToUTF16: " +
      getSizeInMB(compressed) +
      " MB\n"
  );
}
medirPesos(data, actores, directores);

guardarDatos(data);
window.location = "index.html";
