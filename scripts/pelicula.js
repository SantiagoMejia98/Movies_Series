const get = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMGUxNDBmYzcyNGQ1OTFjMzAwMWJlNDQ4NDg4MjcxMiIsIm5iZiI6MTcyNTQ3NzAyMS40NzcsInN1YiI6IjY2ZDhiMDlkM2E5NGE0OWMxNjI2ZjAzZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.RdYktkxjOZERUNw2BaaX_ew5YAGVx2pJzAy5kHzi3RI",
  },
};

const traduccionesStatus = {
  Rumored: "Rumoreada",
  Planned: "Planeada",
  "In Production": "En producción",
  "Post Production": "Post-producción",
  Released: "Estrenada",
  Canceled: "Cancelada",
};

const PROVEEDORES_VALIDOS = {
  "Disney Plus": "https://www.disneyplus.com",
  "Amazon Prime Video":
    "https://www.primevideo.com/storefront/home/ref=atv_nb_logo",
  Netflix: "https://www.netflix.com/browse",
  "Apple TV Plus+": "https://tv.apple.com/co/search",
  Max: "https://play.max.com/search",
  "Paramount Plus": "https://www.paramountplus.com/co/search/",
  Crunchyroll: "https://www.crunchyroll.com/es-es/search",
};

const dropdownMenu = document.getElementById("dropdown-menu");

const elementos = {
  coleccion: document.querySelector('[data-name="coleccion"]'),
  pelicula: document.querySelector('[data-name="pelicula"]'),
};

let todasLasPeliculas = {};
let coleccionesId = {};
let peliculasId = {};
let titulo;
let actores = {};
let directores = {};
let aleatorio;
let generos = {};
let proveedoresID = {};

async function cargarDatosGuardados() {
  todasLasPeliculas = JSON.parse(localStorage.getItem("peliculasCard"));
  coleccionesId = JSON.parse(localStorage.getItem("coleccionesId"));
  peliculasId = JSON.parse(localStorage.getItem("peliculasId"));
  actores = JSON.parse(localStorage.getItem("actores"));
  directores = JSON.parse(localStorage.getItem("directores"));
  generos = JSON.parse(localStorage.getItem("generos"));
  proveedoresID = JSON.parse(localStorage.getItem("proveedores"));

  aleatorio = JSON.parse(localStorage.getItem("aleatorio"));

  if (!aleatorio) {
    const claves = Object.keys(todasLasPeliculas);
    aleatorio = claves[Math.floor(Math.random() * claves.length)];
    titulo = todasLasPeliculas[aleatorio];
  } else {
    localStorage.removeItem("aleatorio");
    if (aleatorio.length > 1) {
      titulo = todasLasPeliculas[aleatorio[0]].Peliculas[aleatorio[1]];
    } else {
      titulo = todasLasPeliculas[aleatorio];
    }
  }
  if (titulo.Tipo === "collection") {
    crearColeccion(elementos.coleccion, titulo);
  } else {
    crearPelicula(elementos.pelicula, titulo);
  }
}

await cargarDatosGuardados();

function crearColeccion(elemento, datos) {
  const containerExistente = elemento.querySelector(".container");

  if (containerExistente) {
    elemento.removeChild(containerExistente);
  }

  const container = document.createElement("div");
  container.className = "container";

  const content = document.createElement("div");
  content.className = "content";
  content.setAttribute("data-id", datos.Id);

  content.innerHTML = `
    <div class="background" 
      style="background-image: url('https://image.tmdb.org/t/p/original${
        window.innerHeight > window.innerWidth ? datos.Movil : datos.Portada
      }')">
    </div>
    
    <div class="movie-card">
      <img class="poster" 
        src="https://image.tmdb.org/t/p/w500${datos.Poster}" alt="${
    datos.Nombre
  }">
      <div class="details">
        <h2>${datos.Nombre}</h2>
        <p>${
          datos.Generos.length > 0
            ? datos.Generos.map((genero) => generos[genero]).join(", ") +
              " &bull; "
            : ""
        }${
    datos.Lanzamiento !== "Desconocido" ? `(${datos.Lanzamiento}) &bull; ` : ""
  }${datos.Duracion}</p>
        <ul>
          <li class="bookmark-item filled">
            <i class="fa-solid fa-bookmark" id="${datos.Id}"></i>
          </li>
        </ul>
        ${
          datos.Descripcion
            ? `<h3>Sinopsis</h3>
          <p>${datos.Descripcion}</p>`
            : ""
        }
      </div>
    </div>`;

  const ordenado = Object.values(datos.Peliculas).sort(
    (x, y) => x.Lanzamiento - y.Lanzamiento
  );
  const coleccion = document.createElement("div");
  coleccion.className = "coleccion";
  coleccion.innerHTML = `<h2>Colección</h2>`;
  const ul = document.createElement("ul");
  ul.className = "lista";
  ordenado.forEach((pelicula) => {
    const li = document.createElement("li");
    li.className = "card";
    li.setAttribute("data-id", pelicula.Id);
    li.setAttribute("data-type", pelicula.Tipo);
    li.setAttribute("data-collection", datos.Id);

    li.innerHTML = `
      <div class="pelicula-container">
        <h3><strong>${pelicula.Nombre.split(" (")[0]}${
      pelicula.Lanzamiento !== "9999" ? ` (${pelicula.Lanzamiento})` : ""
    }</strong></h3>
        <img src="https://image.tmdb.org/t/p/w500${pelicula.Poster}" alt="${
      pelicula.Nombre
    }">
        <p>${
          pelicula.Duracion !== "0h 0min" ? pelicula.Duracion : "Sin estrenar"
        }</p>
      </div>
      `;

    ul.appendChild(li);
  });

  coleccion.appendChild(ul);
  content.appendChild(coleccion);
  container.appendChild(content);
  elemento.appendChild(container);

  const background = document.querySelector(".background");
  background.setAttribute(
    "data-bg-vertical",
    `https://image.tmdb.org/t/p/original${datos.Movil}`
  );
  background.setAttribute(
    "data-bg-horizontal",
    `https://image.tmdb.org/t/p/original${datos.Portada}`
  );
  // Pre-cargar ambas imágenes
  const preloadVertical = new Image();
  preloadVertical.src = `https://image.tmdb.org/t/p/original${datos.Movil}`;

  const preloadHorizontal = new Image();
  preloadHorizontal.src = `https://image.tmdb.org/t/p/original${datos.Portada}`;
}

function crearPelicula(elemento, datos) {
  const containerExistente = elemento.querySelector(".container");

  if (containerExistente) {
    elemento.removeChild(containerExistente);
  }

  const container = document.createElement("div");
  container.className = "container";

  const content = document.createElement("div");
  content.className = "content";
  content.setAttribute("data-id", datos.Id);
  if (datos.Coleccion) {
    content.setAttribute("data-collection", datos.Coleccion);
  }

  if (datos.Logo) {
    content.innerHTML = `
    <div class="background" 
      style="background-image: url('https://image.tmdb.org/t/p/original${
        window.innerHeight > window.innerWidth ? datos.Movil : datos.Portada
      }')">
    </div>
    
    <div class="logo-container">
        <img class="logo" src="https://image.tmdb.org/t/p/w500${
          datos.Logo
        }" alt="${datos.Nombre}">
    </div>
  `;
  } else {
    content.innerHTML = `
    <div class="background" 
      style="background-image: url('https://image.tmdb.org/t/p/original${
        window.innerHeight > window.innerWidth ? datos.Movil : datos.Portada
      }')">
    </div>
  `;
  }

  const moviecard = document.createElement("div");
  moviecard.className = "movie-card";

  moviecard.innerHTML = `
    <img class="poster" src="https://image.tmdb.org/t/p/w500${datos.Poster}" alt="${datos.Nombre}"> 
    `;

  const details = document.createElement("div");
  details.className = "details";

  details.innerHTML = `
    <h2>${datos.Nombre}</h2>
    <p>${
      datos.Generos.length > 0
        ? datos.Generos.map((genero) => generos[genero]).join(", ")
        : ""
    }${datos.Lanzamiento !== "9999" ? ` &bull; ${datos.Lanzamiento}` : ""}${
    datos.Duracion !== "0h 0min" ? ` &bull; ${datos.Duracion}` : ""
  } &bull; ${traduccionesStatus[datos.Status]}</p>
    <p><i>${datos.Tagline ? datos.Tagline : ""}</i></p> 
    <ul>
    <li class="movie-item">
    <a href="https://www.youtube.com/results?search_query=${
      datos.Nombre +
      " " +
      (datos.Lanzamiento !== "9999" ? datos.Lanzamiento : "") +
      " trailer subtitulado español"
    }" target="_blank"><img src="https://image.tmdb.org/t/p/w92/pTnn5JwWr4p3pG8H6VrpiQo7Vs0.jpg">
    </a>
      </li>
      ${
        datos.Coleccion
          ? `<li class="collection-item" data-collection="${
              datos.Coleccion
            }"><p>&#128218; ${
              todasLasPeliculas[datos.Coleccion].Nombre
            }</p></li>`
          : `<li class="bookmark-item filled">
            <i class="fa-solid fa-bookmark" id="${datos.Id}"></i>
          </li>`
      }
    </ul>
    ${datos.Descripcion ? `<h3>Sinopsis</h3> <p>${datos.Descripcion}</p>` : ""}
    `;

  const proveedores = document.createElement("div");
  proveedores.className = "streaming-providers";

  proveedores.innerHTML = `
    <h3>Streaming on</h3>
  `;

  if (datos.Proveedores.length < 1) {
    proveedores.innerHTML += `
      <p>No disponible en Streaming</p>
    `;
  } else {
    const ulProvider = document.createElement("ul");
    ulProvider.className = "providers-list";

    datos.Proveedores.forEach((proveedor) => {
      const li = document.createElement("li");

      li.innerHTML = `
        <a class="pro" href="${
          PROVEEDORES_VALIDOS[proveedoresID[proveedor].Nombre]
            ? PROVEEDORES_VALIDOS[proveedoresID[proveedor].Nombre]
            : "#"
        }" target="_blank"><img src="https://image.tmdb.org/t/p/w92${
        proveedoresID[proveedor].Logo
      }" alt="${proveedoresID[proveedor].Nombre}"></a>
      `;

      ulProvider.appendChild(li);
    });
    proveedores.appendChild(ulProvider);
  }

  details.appendChild(proveedores);
  moviecard.appendChild(details);

  const cardcast = document.createElement("div");
  cardcast.className = "card-cast";

  const director = document.createElement("div");
  director.className = "reparto";

  if (datos.Directores.length > 1) {
    director.innerHTML = `<h3>Directores</h3>`;
  } else if (datos.Directores.length === 1) {
    director.innerHTML = `<h3>Director</h3>`;
  }
  const ulDirector = document.createElement("ul");
  ulDirector.className = "director-list";

  datos.Directores.forEach((director) => {
    const li = document.createElement("li");
    li.className = "director";

    li.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w185${directores[director].Foto}" alt="${directores[director].Nombre}">
        <p class="director-name">${directores[director].Nombre}</p>
        `;

    ulDirector.appendChild(li);
  });

  director.appendChild(ulDirector);
  cardcast.appendChild(director);

  const cast = document.createElement("div");
  cast.className = "reparto";

  if (datos.Reparto.length > 0) {
    cast.innerHTML = `<h3>Reparto</h3>`;
  }

  const ulCast = document.createElement("ul");
  ulCast.className = "cast-list";

  datos.Reparto.forEach((actor) => {
    const li = document.createElement("li");
    li.className = "actor";

    li.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w185${actores[actor].Foto}" alt="${actores[actor].Nombre}">
        <p class="actor-name">${actores[actor].Nombre}</p>
        `;

    ulCast.appendChild(li);
  });

  cast.appendChild(ulCast);
  cardcast.appendChild(cast);
  content.appendChild(moviecard);
  content.appendChild(cardcast);
  container.appendChild(content);
  elemento.appendChild(container);

  const background = document.querySelector(".background");
  background.setAttribute(
    "data-bg-vertical",
    `https://image.tmdb.org/t/p/original${datos.Movil}`
  );
  background.setAttribute(
    "data-bg-horizontal",
    `https://image.tmdb.org/t/p/original${datos.Portada}`
  );
  // Pre-cargar ambas imágenes
  const preloadVertical = new Image();
  preloadVertical.src = `https://image.tmdb.org/t/p/original${datos.Movil}`;

  const preloadHorizontal = new Image();
  preloadHorizontal.src = `https://image.tmdb.org/t/p/original${datos.Portada}`;

  if (datos.Proveedores.length > 0) {
    const a = document.querySelector(".pro");
    a.addEventListener("click", copiarNombre);
  }
}

function seleccionarElementosAleatorios(tamaño) {
  return Math.floor(Math.random() * tamaño);
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

dropdownMenu.addEventListener("change", manejarSeleccion);

function guardarDatos() {
  localStorage.setItem("peliculasCard", JSON.stringify(todasLasPeliculas));
  localStorage.setItem("coleccionesId", JSON.stringify(coleccionesId));
  localStorage.setItem("peliculasId", JSON.stringify(peliculasId));
}

document.querySelectorAll(".bookmark-item").forEach((item) => {
  item.addEventListener("click", function () {
    const icon = this.querySelector("i");
    const id = parseInt(icon.id);

    // Alternar entre icono vacío y relleno
    if (icon.classList.contains("fa-regular")) {
      icon.classList.remove("fa-regular");
      icon.classList.add("fa-solid");

      if (titulo.Tipo === "collection") {
        coleccionesId[id] = titulo.Partes;
        coleccionesId[id].forEach((peliculaId) => {
          peliculasId[peliculaId] = id;
        });
        todasLasPeliculas[id] = titulo;
        const body = {
          media_type: "movie",
          media_id: coleccionesId[id][0],
          watchlist: true,
        };
        modificarWatchlist(body);
        guardarDatos();
      } else {
        peliculasId[id] = titulo.Coleccion;
        todasLasPeliculas[id] = titulo;
        const body = {
          media_type: "movie",
          media_id: id,
          watchlist: true,
        };
        modificarWatchlist(body);
        guardarDatos();
      }
    } else {
      icon.classList.remove("fa-solid");
      icon.classList.add("fa-regular");

      if (titulo.Tipo === "collection") {
        coleccionesId[id].forEach((peliculaId) => {
          delete peliculasId[peliculaId];
          const body = {
            media_type: "movie",
            media_id: peliculaId,
            watchlist: false,
          };
          modificarWatchlist(body);
        });
        delete coleccionesId[id];
        delete todasLasPeliculas[id];
        guardarDatos();
      } else {
        delete peliculasId[id];
        delete todasLasPeliculas[id];
        const body = {
          media_type: "movie",
          media_id: id,
          watchlist: false,
        };
        modificarWatchlist(body);
        guardarDatos();
      }
    }

    // Alternar la clase "filled" para cambiar el color
    this.classList.toggle("filled");
  });
});

document.addEventListener("click", function (event) {
  const card = event.target.closest(".card");
  if (!card) return;

  const id = card.getAttribute("data-id");
  const coleccion = card.getAttribute("data-collection");
  const aleatorio = [coleccion, id];
  localStorage.setItem("aleatorio", JSON.stringify(aleatorio));
  window.location.href = "pelicula.html";
});

function detectarOrientacion() {
  const elemento = document.querySelector(".background");
  if (window.innerHeight > window.innerWidth) {
    elemento.style.backgroundImage = `url(${elemento.getAttribute(
      "data-bg-vertical"
    )})`;
  } else {
    elemento.style.backgroundImage = `url(${elemento.getAttribute(
      "data-bg-horizontal"
    )})`;
  }
}
//alert(`w:${window.innerWidth} h:${window.innerHeight}`);
window.addEventListener("resize", detectarOrientacion);

function copiarNombre() {
  const nombre = document.querySelector(".details h2").innerText.split(" (")[0];
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(nombre).catch((err) => {
      console.warn("No se pudo copiar el nombre:", err);
    });
  }
}

document
  .querySelector(".collection-item")
  ?.addEventListener("click", function () {
    const coleccion = this.getAttribute("data-collection");
    const aleatorio = [coleccion];
    localStorage.setItem("aleatorio", JSON.stringify(aleatorio));
    window.location.href = "pelicula.html";
  });

window.addEventListener("pageshow", () => {
  dropdownMenu.value = "pelicula";
});
