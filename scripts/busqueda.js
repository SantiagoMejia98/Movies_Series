const elementos = {
  busqueda: document.querySelector('[data-name="busqueda"]'),
  presentes: document.querySelector('[data-name="presentes"]'),
  nuevas: document.querySelector('[data-name="nuevas"]'),
};

const get = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMGUxNDBmYzcyNGQ1OTFjMzAwMWJlNDQ4NDg4MjcxMiIsIm5iZiI6MTcyNTQ3NzAyMS40NzcsInN1YiI6IjY2ZDhiMDlkM2E5NGE0OWMxNjI2ZjAzZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.RdYktkxjOZERUNw2BaaX_ew5YAGVx2pJzAy5kHzi3RI",
  },
};
const INCLUIDOS = [8, 119, 337, 1899, 350, 531, 11, 283, 339, 1889, 2141];

let peliculas;
let series;
let colecciones;
let coleccionesID;
let peliculasID;
let seriesID;
let coleccionesBuscadas;
let peliculasBuscadas;
let seriesBuscadas;
let todasLasPeliculas;
let todasLasSeries;
let nuevas;
let presentes;
let peliculasAgregar = {};
let coleccionAgregar = {};
let seriesAgregar = {};
let actores = {};
let directores = {};
let generos = {};
let proveedores = {};

async function cargarDatosGuardados() {
  peliculas = JSON.parse(localStorage.getItem("peliculasId"));
  series = new Set(JSON.parse(localStorage.getItem("seriesId")));
  colecciones = JSON.parse(localStorage.getItem("coleccionesId"));
  todasLasPeliculas = JSON.parse(localStorage.getItem("peliculasCard"));
  todasLasSeries = JSON.parse(localStorage.getItem("seriesCard"));
  actores = JSON.parse(localStorage.getItem("actores"));
  directores = JSON.parse(localStorage.getItem("directores"));
  generos = JSON.parse(localStorage.getItem("generos"));
  proveedores = JSON.parse(localStorage.getItem("proveedores"));
}

async function guardarDatosGuardados() {
  localStorage.setItem("peliculasId", JSON.stringify(peliculas));
  localStorage.setItem("seriesId", JSON.stringify(Array.from(series)));
  localStorage.setItem("coleccionesId", JSON.stringify(colecciones));
  localStorage.setItem("peliculasCard", JSON.stringify(todasLasPeliculas));
  localStorage.setItem("seriesCard", JSON.stringify(todasLasSeries));
  localStorage.setItem("actores", JSON.stringify(actores));
  localStorage.setItem("directores", JSON.stringify(directores));
  localStorage.setItem("generos", JSON.stringify(generos));
  localStorage.setItem("proveedores", JSON.stringify(proveedores));
}

await cargarDatosGuardados();

const busquedaInput = document.getElementById("search-input");
const boton = document.getElementById("search-button");
const dropdownMenu = document.getElementById("dropdown-menu");

function crearListaBusquedaPresente(elemento, datos) {
  elemento.className = "hidden";
  const ulExistente = elemento.querySelector("ul");

  if (ulExistente) {
    elemento.removeChild(ulExistente);
  }

  const ul = document.createElement("ul");
  ul.className = "lista";

  Object.values(datos).forEach((pelicula) => {
    elemento.className = "";
    const li = document.createElement("li");
    li.className = "card";
    li.setAttribute("data_id", pelicula.Id);
    li.setAttribute("data_type", pelicula.Tipo);

    li.innerHTML = `
              <div class="pelicula-container">
                  <h2 class="titulo"><strong>${
                    pelicula.Nombre.split(" (")[0]
                  }</strong></h2>
                  <img src="https://image.tmdb.org/t/p/w500${
                    pelicula.Poster
                  }" alt="${pelicula.Nombre}">
                  <div class="informacion">
                      <p class="fecha">${
                        pelicula.Lanzamiento ? pelicula.Lanzamiento : ""
                      }</p>
                      <p class="tipo" id="tipo">${pelicula.Tipo}</p>
                      <button class="eliminar-btn">Eliminar</button>
                  </div>
              </div>
          `;

    ul.appendChild(li);
  });

  elemento.appendChild(ul);
}

function crearListaBusquedaNueva(elemento, datos) {
  elemento.className = "hidden";
  const ulExistente = elemento.querySelector("ul");

  if (ulExistente) {
    elemento.removeChild(ulExistente);
  }

  const ul = document.createElement("ul");
  ul.className = "lista";

  Object.values(datos).forEach((pelicula) => {
    elemento.className = "";
    const li = document.createElement("li");
    li.className = "card";
    li.setAttribute("data_id", pelicula.Id);
    li.setAttribute("data_type", pelicula.Tipo);

    li.innerHTML = `
              <div class="pelicula-container">
                  <h2 class="titulo"><strong>${
                    pelicula.Nombre.split(" (")[0]
                  }</strong></h2>
                  <img src="https://image.tmdb.org/t/p/w500${
                    pelicula.Poster
                  }" alt="${pelicula.Nombre}">
                  <div class="informacion">
                      <p class="fecha">${
                        pelicula.Lanzamiento ? pelicula.Lanzamiento : ""
                      }</p>
                      <p class="tipo" id="tipo">${pelicula.Tipo}</p>
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
    Id: titulo.id,
    Nombre:
      titulo.title ||
      titulo.name ||
      titulo.original_title ||
      titulo.original_name,
    Lanzamiento:
      titulo.release_date?.split(/[-/]/).find((part) => part.length === 4) ||
      "",
    Tipo: "movie",
    Poster: titulo.poster_path || null,
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
      ? `${titulo.first_air_date.split(/[-/]/).find((p) => p.length === 4)}`
      : "Desconocido",
    Id: titulo.id,
    Tipo: "tv",
    Poster: titulo.poster_path || null,
  };
}

function JSONcoleccion(data) {
  return {
    Nombre: data.original_name || data.name,
    Lanzamiento: null,
    Poster: data.poster_path || null,
    Id: data.id,
    Tipo: "collection",
    Partes: data.parts?.map((parte) => parte.id),
  };
}

function JSONpeliculaAgregar(titulo) {
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

function JSONserieAgregar(titulo) {
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

function JSONcoleccionAgregar(titulo) {
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

async function buscarPeliculasAgregar(id) {
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
      if (data.belongs_to_collection) {
        peliculas[id] = data.belongs_to_collection.id;
        peliculasAgregar[id] = JSONpeliculaAgregar(data);
        if (!colecciones[data.belongs_to_collection.id]) {
          await buscarColeccionAgregar(data.belongs_to_collection.id);
        }
      } else {
        peliculas[id] = null;
        peliculasAgregar = JSONpeliculaAgregar(data);
      }
    }
  } catch (err) {
    console.error("Error al cargar datos:", err);
  }
}

async function buscarSeriesAgregar(id) {
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
      series.add(parseInt(id));

      seriesAgregar = JSONserieAgregar(data);
    }
  } catch (err) {
    console.error("Error al cargar datos:", err);
  }
}

async function buscarColeccionAgregar(id) {
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
      coleccionAgregar = JSONcoleccionAgregar(data);
      const partes = data.parts.map((item) => item.id);
      colecciones[id] = partes;

      for (const pelicula of data.parts) {
        if (!peliculasAgregar[pelicula.id]) {
          await buscarPeliculasAgregar(pelicula.id);
        }
      }
    }
  } catch (err) {
    console.error("Error al cargar datos:", err);
  }
}

async function buscarColeccion(query) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/collection?query=${query} collection`,
      get
    );

    if (!res.ok) {
      throw new Error(`Error al realizar la solicitud: ${res.status}`);
    }

    const data = await res.json();
    if (data.results) {
      data.results.forEach((coleccion) => {
        if (coleccion.poster_path === null) return;
        coleccionesBuscadas[coleccion.id] = JSONcoleccion(coleccion);
        coleccionesID.add(coleccion.id);
      });
      return coleccionesID;
    }
  } catch (err) {
    console.error("Error al cargar datos:", err);
  }
}

async function busqueda(query, tipo) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/${tipo}?query=${query}`,
      get
    );

    if (!res.ok) {
      throw new Error(`Error al realizar la solicitud: ${res.status}`);
    }
    const data = await res.json();
    if (data.results) {
      data.results.forEach((titulo) => {
        if (tipo === "movie") {
          if (titulo.poster_path === null) return;
          peliculasBuscadas[titulo.id] = JSONpelicula(titulo);
          peliculasID.add(titulo.id);
        } else if (tipo === "tv") {
          if (titulo.poster_path === null) return;
          seriesBuscadas[titulo.id] = JSONserie(titulo);
          seriesID.add(titulo.id);
        }
      });
    }
  } catch (err) {
    console.error("Error al cargar datos:", err);
  }
}

async function buscarDetallesColeccion(id) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/collection/${id}`,
      get
    );

    if (!res.ok) {
      throw new Error(`Error al realizar la solicitud: ${res.status}`);
    }

    const data = await res.json();
    if (data) {
      nuevas[data.id] = JSONcoleccion(data);
    }
  } catch (err) {
    console.error("Error al cargar datos:", err);
  }
}

async function buscar() {
  nuevas = {};
  presentes = {};
  coleccionesBuscadas = {};
  peliculasBuscadas = {};
  seriesBuscadas = {};
  coleccionesID = new Set();
  peliculasID = new Set();
  seriesID = new Set();

  const query = document.getElementById("search-input").value;
  document.getElementById("search-input").value = "";

  await buscarColeccion(query);

  coleccionesID.forEach(async (id) => {
    if (colecciones[id] === undefined) {
      await buscarDetallesColeccion(id);
    } else {
      presentes[id] = todasLasPeliculas[id];
    }
  });

  await busqueda(query, "movie");

  Object.values(nuevas).forEach((coleccion) => {
    coleccion.Partes.forEach((id) => {
      if (peliculasID.has(id)) {
        peliculasID.delete(id);
      }
    });
  });

  peliculasID.forEach((id) => {
    if (peliculas[id] === undefined) {
      nuevas[id] = peliculasBuscadas[id];
    } else if (peliculas[id] === null) {
      presentes[id] = todasLasPeliculas[id];
    } else {
      presentes[peliculas[id]] = todasLasPeliculas[peliculas[id]];
    }
  });

  await busqueda(query, "tv");
  seriesID.forEach((id) => {
    if (series.has(id)) {
      presentes[id] = todasLasSeries[id];
    } else {
      nuevas[id] = seriesBuscadas[id];
    }
  });

  crearListaBusquedaNueva(elementos.nuevas, nuevas);
  crearListaBusquedaPresente(elementos.presentes, presentes);
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
}

document.querySelectorAll('[data-name="busqueda"]').forEach((contenedor) => {
  contenedor.addEventListener("click", async function (event) {
    if (event.target.classList.contains("agregar-btn")) {
      const card = event.target.closest(".card");
      if (!card) return;

      const tipo = card.getAttribute("data_type");
      const id = parseInt(card.getAttribute("data_id"));
      if (tipo === "collection") {
        peliculasAgregar = {};
        coleccionAgregar = {};
        await buscarColeccionAgregar(id);
        coleccionAgregar.Peliculas = peliculasAgregar;
        let generos = new Set();
        let proveedoresColeccion = new Set();
        Object.values(peliculasAgregar).forEach((pelicula) => {
          let genero = pelicula.Generos;
          let proveedoresPelicula = pelicula.Proveedores;
          for (const g of genero) {
            generos.add(g);
          }
          for (const p of proveedoresPelicula) {
            proveedoresColeccion.add(p);
          }
        });
        coleccionAgregar.Generos = Array.from(generos);
        coleccionAgregar.Proveedores = Array.from(proveedoresColeccion);

        todasLasPeliculas[id] = coleccionAgregar;
        const body = {
          media_id: coleccionAgregar.Partes[0],
          media_type: "movie",
          watchlist: true,
        };
        modificarWatchlist(body);
        presentes[id] = nuevas[id];
        delete nuevas[id];
      } else {
        if (tipo === "movie") {
          peliculasAgregar = {};
          coleccionAgregar = {};
          await buscarPeliculasAgregar(id);
          if (Object.keys(coleccionAgregar).length > 0) {
            let generos = new Set();
            let proveedoresColeccion = new Set();
            Object.values(peliculasAgregar).forEach((pelicula) => {
              let genero = pelicula.Generos;
              let proveedoresPelicula = pelicula.Proveedores;
              for (const g of genero) {
                generos.add(g);
              }
              for (const p of proveedoresPelicula) {
                proveedoresColeccion.add(p);
              }
            });
            coleccionAgregar.Generos = Array.from(generos);
            coleccionAgregar.Proveedores = Array.from(proveedoresColeccion);
            coleccionAgregar.Peliculas = peliculasAgregar;
            todasLasPeliculas[coleccionAgregar.Id] = coleccionAgregar;
            presentes[coleccionAgregar.Id] = coleccionAgregar;
            delete nuevas[id];
          } else {
            todasLasPeliculas[id] = peliculasAgregar;
            presentes[id] = nuevas[id];
            delete nuevas[id];
          }
        } else if (tipo === "tv") {
          seriesAgregar = {};

          await buscarSeriesAgregar(id);
          todasLasSeries[id] = seriesAgregar;
          presentes[id] = nuevas[id];
          delete nuevas[id];
        }
        const body = {
          media_id: id,
          media_type: tipo,
          watchlist: true,
        };
        modificarWatchlist(body);
      }
      delete nuevas[id];
      crearListaBusquedaPresente(elementos.presentes, presentes);
      crearListaBusquedaNueva(elementos.nuevas, nuevas);
      guardarDatosGuardados();
    } else if (event.target.classList.contains("eliminar-btn")) {
      const card = event.target.closest(".card");
      if (!card) return;

      const tipo = card.getAttribute("data_type");
      const id = parseInt(card.getAttribute("data_id"));
      if (tipo === "collection") {
        const coleccion = colecciones[id];
        delete colecciones[id];
        delete todasLasPeliculas[id];
        coleccion.forEach((id) => {
          delete peliculas[id];
        });

        coleccion.forEach((id) => {
          const body = {
            media_id: id,
            media_type: "movie",
            watchlist: false,
          };
          modificarWatchlist(body);
        });
      } else {
        if (tipo === "movie") {
          delete peliculas[id];
          delete todasLasPeliculas[id];
        } else if (tipo === "tv") {
          series.delete(id);
          delete todasLasSeries[id];
        }
        const body = {
          media_id: id,
          media_type: tipo,
          watchlist: false,
        };
        modificarWatchlist(body);
      }
      nuevas[id] = presentes[id];
      delete presentes[id];
      crearListaBusquedaPresente(elementos.presentes, presentes);
      crearListaBusquedaNueva(elementos.nuevas, nuevas);
      guardarDatosGuardados();
    }
  });
});

dropdownMenu.addEventListener("change", manejarSeleccion);
boton.addEventListener("click", buscar);

window.addEventListener("pageshow", () => {
  dropdownMenu.value = "busqueda";
});
