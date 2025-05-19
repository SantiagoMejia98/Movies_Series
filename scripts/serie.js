const get = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMGUxNDBmYzcyNGQ1OTFjMzAwMWJlNDQ4NDg4MjcxMiIsIm5iZiI6MTcyNTQ3NzAyMS40NzcsInN1YiI6IjY2ZDhiMDlkM2E5NGE0OWMxNjI2ZjAzZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.RdYktkxjOZERUNw2BaaX_ew5YAGVx2pJzAy5kHzi3RI",
  },
};

const dropdownMenu = document.getElementById("dropdown-menu");

const elementos = {
  serie: document.querySelector('[data-name="serie"]'),
};

const traduccionesStatus = {
  "Returning Series": "En emisión",
  Planned: "Planeada",
  "In Production": "En producción",
  Ended: "Finalizada",
  Canceled: "Cancelada",
  Pilot: "Piloto",
};

const PROVEEDORES_VALIDOS = {
  "Disney Plus": "https://www.disneyplus.com",
  "Amazon Prime Video":
    "https://www.primevideo.com/storefront/home/ref=atv_nb_logo",
  Netflix: "https://www.netflix.com/browse",
  "Apple TV+": "https://tv.apple.com/co/search",
  Max: "https://play.max.com/search",
  "Paramount Plus": "https://www.paramountplus.com/co/search/",
  Crunchyroll: "https://www.crunchyroll.com/es-es/search",
};

let todasLasSeries = {};
let actores = {};
let directores = {};
let aleatorio;

async function cargarDatosGuardados() {
  todasLasSeries = JSON.parse(localStorage.getItem("seriesCard"));
  actores = JSON.parse(localStorage.getItem("actores"));
  directores = JSON.parse(localStorage.getItem("directores"));
  aleatorio = JSON.parse(localStorage.getItem("aleatorio"));
  console.log(aleatorio);
  let titulo;
  if (!aleatorio) {
    const claves = Object.keys(todasLasSeries);
    aleatorio = claves[Math.floor(Math.random() * claves.length)];
    titulo = todasLasSeries[aleatorio];
  } else {
    localStorage.removeItem("aleatorio");
    titulo = todasLasSeries[aleatorio];
  }
  localStorage.removeItem("aleatorio");
  crearSerie(elementos.serie, titulo);
}

await cargarDatosGuardados();

function crearSerie(elemento, datos) {
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
    <p>${datos.Generos !== "" ? datos.Generos : ""}${
    datos.Lanzamiento !== "Desconocido" ? ` &bull; ${datos.Lanzamiento}` : ""
  }${datos.Duracion !== "0h 0min" ? ` &bull; ${datos.Duracion}` : ""} &bull; ${
    traduccionesStatus[datos.Status]
  }</p>
    <p><i>${datos.Tagline ? datos.Tagline : ""}</i></p> 
    <ul>
    <li class="movie-item">
    <a href="https://www.youtube.com/results?search_query=${
      datos.Nombre + " season 1 trailer subtitulado español latino"
    }" target="_blank"><img src="https://image.tmdb.org/t/p/w92/pTnn5JwWr4p3pG8H6VrpiQo7Vs0.jpg">
    </a>
      </li>
      <li class="bookmark-item">
            <i class="fa-regular fa-bookmark" id="${datos.Id}"></i>
          </li>
    </ul>
    ${
      datos.Descripcion ? `<h3>Sinopsis</h3> <p>${datos.Descripcion}</p>` : ""
    }`;

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
          PROVEEDORES_VALIDOS[proveedor.Nombre]
        }" target="_blank"><img src="https://image.tmdb.org/t/p/w92${
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
        <img src="https://image.tmdb.org/t/p/w185${
          directores[director.Id].Foto
        }" alt="${directores[director.Id].Nombre}">
        <p class="director-name">${directores[director.Id].Nombre}</p>
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
        <img src="https://image.tmdb.org/t/p/w185${
          actores[actor.Id].Foto
        }" alt="${actores[actor.Id].Nombre}">
        <p class="actor-name">${actores[actor.Id].Nombre}</p>
        <p>${actor.Personaje}</p>
        `;

    ulCast.appendChild(li);
  });

  cast.appendChild(ulCast);
  cardcast.appendChild(cast);
  content.appendChild(moviecard);
  content.appendChild(cardcast);

  if (
    (datos.Status !== "Ended" && datos.Status !== "Canceled") ||
    datos.Duracion.split(" -")[0] !== "1 temporada"
  ) {
    const coleccion = document.createElement("div");
    coleccion.className = "coleccion";
    coleccion.innerHTML = `<h2>Temporadas</h2>`;
    const ulSeason = document.createElement("ul");
    ulSeason.className = "lista";
    datos.Temporadas.forEach((temporada) => {
      const li = document.createElement("li");
      li.className = "card";

      li.innerHTML = `
      <div class="pelicula-container">
        <h3><strong>${temporada.Nombre} (${
        temporada.Lanzamiento !== "9999" ? temporada.Lanzamiento : ""
      })</strong></h3>
        <img src="https://image.tmdb.org/t/p/w500${temporada.Poster}" alt="${
        temporada.Nombre
      }">
        <p>${temporada.Duracion}</p>
      </div>
      `;

      ulSeason.appendChild(li);
    });

    coleccion.appendChild(ulSeason);
    content.appendChild(coleccion);
  }

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

function guardarDatos(data) {
  const jsonString = JSON.stringify(data);
  const datos = LZString.compressToUTF16(jsonString);
  localStorage.setItem("datos", datos);
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
