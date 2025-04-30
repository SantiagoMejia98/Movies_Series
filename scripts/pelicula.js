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
  "Disney Plus": "https://www.disneyplus.com/es-419/browse/search",
  "Amazon Prime Video":
    "https://www.primevideo.com/search/ref=atv_nb_sug?ie=UTF8&phrase={query}&i=instant-video",
  Netflix: "https://www.netflix.com/search?q={query}",
  "Apple TV Plus": "https://tv.apple.com/search/{query}",
  Max: "https://play.max.com/search?q={query}",
  "Paramount Plus": "https://www.paramountplus.com/shows/{query}/",
  Crunchyroll: "https://www.crunchyroll.com/es-es/search?q={query}",
};

function obtenerLinkBusqueda(proveedor, titulo) {
  const baseUrl = PROVEEDORES_VALIDOS[proveedor];
  if (!baseUrl) return null;
  let query;
  if (proveedor === "Paramount Plus") {
    query = titulo
      .replace(/ /g, "-")
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "");
  } else {
    query = encodeURIComponent(titulo);
  }
  return baseUrl.replace("{query}", query);
}

const dropdownMenu = document.getElementById("dropdown-menu");

const elementos = {
  coleccion: document.querySelector('[data-name="coleccion"]'),
  pelicula: document.querySelector('[data-name="pelicula"]'),
};

let todasLasPeliculas = new Set();
let todasLasSeries = new Set();
let peliculas = {};
let series = {};
let colecciones = {};
let data = {};
let aleatorio;

async function cargarDatosGuardados() {
  peliculas = JSON.parse(
    LZString.decompressFromUTF16(localStorage.getItem("peliculas"))
  );
  colecciones = JSON.parse(
    LZString.decompressFromUTF16(localStorage.getItem("colecciones"))
  );
  todasLasPeliculas = JSON.parse(
    LZString.decompressFromUTF16(localStorage.getItem("peliculasCard"))
  );
  aleatorio = localStorage.getItem("aleatorio");
  if (aleatorio) {
    aleatorio = JSON.parse(aleatorio);
  }
  let titulo;
  if (!aleatorio) {
    aleatorio = seleccionarElementosAleatorios(todasLasPeliculas.length);
    titulo = todasLasPeliculas[aleatorio];
  } else {
    if (aleatorio.Tipo === "movie") {
      titulo = peliculas[aleatorio.Id];
    } else {
      titulo = colecciones[aleatorio.Id];
    }
    guardarDatos(data);
  }
  if (titulo.Tipo === "movie") {
    crearPelicula(elementos.pelicula, titulo);
  } else {
    crearColeccion(elementos.coleccion, titulo);
  }
  localStorage.removeItem("aleatorio");
}

function guardarDatos(data) {
  localStorage.setItem("aleatorio", JSON.stringify(data));
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
        <h2>${datos.Nombre.split(" (")[0]}</h2>
        <p>${peliculas[datos.Peliculas[0]].Generos} &bull; (${
    datos.Lanzamiento
  }) &bull; ${datos.Duracion}</p>
        <ul>
          <li class="bookmark-item">
            <i class="fa-regular fa-bookmark" id="${datos.Id}"></i>
          </li>
        </ul>
        <h3>Sinopsis</h3>
        <p>${datos.Descripcion}</p>
      </div>
    </div>`;

  const coleccion = document.createElement("div");
  coleccion.className = "coleccion";
  coleccion.innerHTML = `<h2>Colección</h2>`;
  const ul = document.createElement("ul");
  ul.className = "lista";
  datos.Peliculas.sort(
    (a, b) => peliculas[a].Lanzamiento - peliculas[b].Lanzamiento
  ).forEach((id) => {
    const li = document.createElement("li");
    li.className = "card";
    li.setAttribute("data-id", peliculas[id].Id);
    li.setAttribute("data-type", peliculas[id].Tipo);

    li.innerHTML = `
      <div class="pelicula-container">
        <h2><strong>${peliculas[id].Nombre.split(" (")[0]}${
      peliculas[id].Lanzamiento !== "9999"
        ? ` (${peliculas[id].Lanzamiento})`
        : ""
    }</strong></h2>
        <img src="https://image.tmdb.org/t/p/w500${
          peliculas[id].Poster
        }" alt="${peliculas[id].Nombre}">
        <p>${peliculas[id].Duracion}</p>
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
    <p>${datos.Generos} ${
    datos.Lanzamiento !== "9999" ? `&bull;${datos.Lanzamiento}` : ""
  } ${datos.Duracion !== "0h 0min" ? `&bull;${datos.Duracion}` : ""} &bull; ${
    traduccionesStatus[datos.Status]
  }</p>
    <p><i>${datos.Tagline ? datos.Tagline : ""}</i></p> 
    ${
      datos.Videos.length > 0
        ? `<ul>
      <li class="movie-item">
        <img src="https://image.tmdb.org/t/p/w92/pTnn5JwWr4p3pG8H6VrpiQo7Vs0.jpg">
        <p>Ver tráiler</p>
      </li>
    </ul>
    
    ${datos.Descripcion ? `<h3>Sinopsis</h3>` : ""}
    <p>${datos.Descripcion}</p>`
        : ""
    }
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
        <a href="${obtenerLinkBusqueda(
          proveedor.Nombre.split(" (")[0],
          datos.Nombre
        )}" target="_blank"><img src="https://image.tmdb.org/t/p/w92${
        proveedor.Logo
      }" alt="${proveedor.Nombre}"></a>
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
        <img src="https://image.tmdb.org/t/p/w185${director.Foto}" alt="${director.Nombre}">
        <p class="director-name">${director.Nombre}</p>
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
        <img src="https://image.tmdb.org/t/p/w185${actor.Foto}" alt="${director.Nombre}">
        <p class="actor-name">${actor.Nombre}</p>
        <p>${actor.Personaje}</p>
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

dropdownMenu.addEventListener("change", manejarSeleccion);

document.querySelectorAll(".bookmark-item").forEach((item) => {
  item.addEventListener("click", function () {
    const icon = this.querySelector("i");

    // Alternar entre icono vacío y relleno
    if (icon.classList.contains("fa-regular")) {
      icon.classList.remove("fa-regular");
      icon.classList.add("fa-solid");
    } else {
      icon.classList.remove("fa-solid");
      icon.classList.add("fa-regular");
    }

    // Alternar la clase "filled" para cambiar el color
    this.classList.toggle("filled");
  });
});

document.addEventListener("click", function (event) {
  const card = event.target.closest(".card");
  if (!card) return;

  const type = card.getAttribute("data-type");
  const id = card.getAttribute("data-id");
  const aleatorio = { Tipo: type, Id: id };
  guardarDatos(aleatorio);
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
    alert(`Nombre "${nombre}".`);
  }
}

const a = document.querySelector("a");
a.addEventListener("click", copiarNombre);
