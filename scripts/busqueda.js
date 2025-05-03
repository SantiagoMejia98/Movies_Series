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

let peliculas = [];
let series = [];
let colecciones = [];
let coleccionesID = {};
let peliculasID = {};
let seriesID = new Set();
let coleccionesBuscadas = {};
let peliculasBuscadas = {};
let seriesBuscadas = {};
let todasLasPeliculas = {};
let todasLasSeries = {};
let nuevas = {};
let presentes = {};

async function cargarDatosGuardados() {
  peliculas = JSON.parse(localStorage.getItem("peliculasId"));
  series = new Set(JSON.parse(localStorage.getItem("seriesId")));
  colecciones = JSON.parse(localStorage.getItem("coleccionesId"));
  todasLasPeliculas = JSON.parse(localStorage.getItem("peliculasCard"));
  todasLasSeries = JSON.parse(localStorage.getItem("seriesCard"));
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
    Lanzamiento: null,
    Poster: data.poster_path || null,
    Id: data.id,
    Tipo: "collection",
    Partes: data.parts?.map((parte) => parte.id),
  };
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
      console.log(data.results);
      data.results.forEach((coleccion) => {
        if (coleccion.poster_path === null) return;
        coleccionesBuscadas[coleccion.id] = JSONcoleccion(coleccion);
        coleccionesID.push(coleccion.id);
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
      console.log(data.results);
      data.results.forEach((titulo) => {
        if (tipo === "movie") {
          if (titulo.poster_path === null) return;
          peliculasBuscadas[titulo.id] = JSONpelicula(titulo);
          peliculasID.push(titulo.id);
        } else if (tipo === "tv") {
          if (titulo.poster_path === null) return;
          seriesBuscadas[titulo.id] = JSONserie(titulo);
          seriesID.push(titulo.id);
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
  coleccionesID = [];
  peliculasID = [];
  seriesID = [];

  const query = document.getElementById("search-input").value;
  document.getElementById("search-input").value = "";

  await buscarColeccion(query);
  console.log(coleccionesBuscadas);
  console.log(coleccionesID);

  coleccionesID.forEach(async (id) => {
    if (colecciones[id] === undefined) {
      await buscarDetallesColeccion(id);
    } else {
      presentes[id] = todasLasPeliculas[id];
    }
  });
  console.log(
    "--------------------------------------------------------------------------------------"
  );
  await busqueda(query, "movie");
  console.log(peliculasBuscadas);
  console.log(peliculasID);

  peliculasID.forEach((id) => {
    if (peliculas[id] === undefined) {
      nuevas[id] = peliculasBuscadas[id];
    } else if (peliculas[id] === null) {
      presentes[id] = todasLasPeliculas[id];
    } else {
      presentes[id] = todasLasPeliculas[peliculas[id]];
    }
  });

  console.log(nuevas);
  console.log(presentes);

  console.log(
    "--------------------------------------------------------------------------------------"
  );

  await busqueda(query, "tv");
  console.log(seriesBuscadas);
  console.log(seriesID);

  console.log(
    "--------------------------------------------------------------------------------------"
  );

  if (coleccionesID.length > 0) {
  }

  if (peliculasID.length > 0) {
  }

  if (seriesID.length > 0) {
  }
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
