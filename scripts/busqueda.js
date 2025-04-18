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

let peliculas = {};
let series = {};
let colecciones = {};
let data = {};
let nuevas = {};
let presentes = {};

async function cargarDatosGuardados() {
  const start = performance.now();
  peliculas = JSON.parse(
    LZString.decompressFromUTF16(localStorage.getItem("peliculas"))
  );
  series = JSON.parse(
    LZString.decompressFromUTF16(localStorage.getItem("series"))
  );
  colecciones = JSON.parse(
    LZString.decompressFromUTF16(localStorage.getItem("colecciones"))
  );

  const end = performance.now();
  alert(`Tiempo de carga de datos: ${(end - start).toFixed(2)} ms`);
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
                      <p class="fecha">${pelicula.Lanzamiento}</p>
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
                      <p class="fecha">${pelicula.Lanzamiento}</p>
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
    Poster: data.poster_path || null,
    Id: data.id,
    Duracion: `${data.parts.length} películas`,
    Tipo: "collection",
    Peliculas: data.parts.map((item) => item.id),
  };
}

async function buscarColeccion(query) {
  let coleccionesID = [];
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/collection?query=${query}`,
      get
    );

    if (!res.ok) {
      throw new Error(`Error al realizar la solicitud: ${res.status}`);
    }

    const data = await res.json();
    if (data.results) {
      coleccionesID = data.results
        .filter((item) => item.poster_path !== null)
        .map((item) => item.id);
      return coleccionesID;
    }
  } catch (err) {
    console.error("Error al cargar datos:", err);
  }
}

async function busqueda(id, tipo) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/${tipo}?query=${id}`,
      get
    );

    if (!res.ok) {
      throw new Error(`Error al realizar la solicitud: ${res.status}`);
    }
    const data = await res.json();
    if (data.results) {
      return data.results.filter((item) => item.poster_path !== null);
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
      return JSONcoleccion(data);
    }
  } catch (err) {
    console.error("Error al cargar datos:", err);
  }
}

async function buscar() {
  nuevas = {};
  presentes = {};
  const query = document.getElementById("search-input").value;
  document.getElementById("search-input").value = "";

  let collection = await buscarColeccion(query);

  if (Array.isArray(collection) && collection.length > 0) {
    const detalles = await Promise.allSettled(
      collection.map(async (id) => {
        if (!colecciones[id]) {
          const coleccion = await buscarDetallesColeccion(id);
          return { id, coleccion, esNueva: true };
        } else {
          return { id, coleccion: colecciones[id], esNueva: false };
        }
      })
    );

    detalles.forEach((resultado) => {
      if (resultado.status === "fulfilled") {
        const { id, coleccion, esNueva } = resultado.value;
        if (coleccion && Array.isArray(coleccion.Peliculas)) {
          if (esNueva) {
            nuevas[id] = coleccion;
          } else {
            presentes[id] = coleccion;
          }
        }
      } else {
        console.warn("Fallo al obtener una colección:", resultado.reason);
      }
    });
  }

  let pelisEncontradas = await busqueda(query, "movie");
  let seriesEncontradas = await busqueda(query, "tv");

  let idsExcluidos = new Set();

  Object.values(nuevas).forEach((coleccion) => {
    if (Array.isArray(coleccion.Peliculas)) {
      coleccion.Peliculas.forEach((id) => idsExcluidos.add(id));
    }
  });

  Object.values(presentes).forEach((coleccion) => {
    if (Array.isArray(coleccion.Peliculas)) {
      coleccion.Peliculas.forEach((id) => idsExcluidos.add(id));
    }
  });

  let pelisFiltradas = pelisEncontradas.filter(
    (titulo) => !idsExcluidos.has(titulo.id)
  );

  let seriesFiltradas = seriesEncontradas.filter(
    (titulo) => !idsExcluidos.has(titulo.id)
  );

  pelisFiltradas.forEach((titulo) => {
    if (!peliculas[titulo.id]) {
      nuevas[titulo.id] = JSONpelicula(titulo);
    } else {
      presentes[titulo.id] = peliculas[titulo.id];
    }
  });

  seriesFiltradas.forEach((titulo) => {
    if (!series[titulo.id]) {
      nuevas[titulo.id] = JSONserie(titulo);
    } else {
      presentes[titulo.id] = series[titulo.id];
    }
  });

  crearListaBusquedaPresente(elementos.presentes, presentes);
  crearListaBusquedaNueva(elementos.nuevas, nuevas);
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
  contenedor.addEventListener("click", function (event) {
    if (event.target.classList.contains("agregar-btn")) {
      const card = event.target.closest(".card");
      if (!card) return;

      const tipo = card.getAttribute("data_type");
      const id = card.getAttribute("data_id");
      if (tipo === "collection") {
        const coleccion = nuevas[id];
        colecciones[id] = coleccion;
        console.log(coleccion);
        const body = {
          media_id: coleccion.Peliculas[0],
          media_type: "movie",
          watchlist: true,
        };
        modificarWatchlist(body);
      } else {
        const body = {
          media_id: id,
          media_type: tipo,
          watchlist: true,
        };
        modificarWatchlist(body);
      }
      presentes[id] = nuevas[id];
      delete nuevas[id];
      crearListaBusquedaPresente(elementos.presentes, presentes);
      crearListaBusquedaNueva(elementos.nuevas, nuevas);
    } else if (event.target.classList.contains("eliminar-btn")) {
      const card = event.target.closest(".card");
      if (!card) return;

      const tipo = card.getAttribute("data_type");
      const id = card.getAttribute("data_id");
      if (tipo === "collection") {
        const coleccion = colecciones[id];
        coleccion.Peliculas.forEach((id) => {
          const body = {
            media_id: id,
            media_type: "movie",
            watchlist: false,
          };
          modificarWatchlist(body);
        });
      } else {
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
    }
  });
});

dropdownMenu.addEventListener("change", manejarSeleccion);
boton.addEventListener("click", buscar);
