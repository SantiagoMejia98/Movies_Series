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
  coleccion: document.querySelector('[data-name="coleccion"]'),
  peliculas: document.querySelector('[data-name="peliculas"]'),
  pelicula: document.querySelector('[data-name="pelicula"]'),
};

let peliculasID = [];
let coleccion = {};
let coleccionID;
let peliculas = [];

function crearColeccion(elemento, datos) {
  const containerExistente = elemento.querySelector(".container");

  if (containerExistente) {
    elemento.removeChild(containerExistente);
  }

  const container = document.createElement("div");
  ul.className = "container";

  datos.forEach((pelicula) => {
    const li = document.createElement("li");
    li.className = "card";

    li.innerHTML = `
              <div class="pelicula-container" id="${pelicula.Id}">
                  <img src="https://image.tmdb.org/t/p/original${pelicula.Poster}" alt="${pelicula.Nombre}">
                  <h2 class="titulo"><strong>${pelicula.Nombre}</strong></h2>
                  <p class="lanzamiento"><strong>Lanzamiento:</strong> ${pelicula.Lanzamiento}</p>
              </div>
          `;

    ul.appendChild(li);
  });

  elemento.appendChild(ul);
}
function seleccionarElementosAleatorios(array) {
  const resultados = [];

  for (let i = 0; i < 1; i++) {
    const indiceAleatorio = Math.floor(Math.random() * array.length);
    console.log(indiceAleatorio);
    resultados.push(array[indiceAleatorio]);
  }
  return resultados[0];
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

async function cargarDatos() {
  try {
    let page = 1;
    let totalPages;

    do {
      const res = await fetch(
        `https://api.themoviedb.org/3/account/21500820/watchlist/movies?page=${page}`,
        get
      );

      if (!res.ok) {
        throw new Error(`Error al realizar la solicitud: ${res.status}`);
      }

      const data = await res.json();

      if (data.results) {
        peliculasID = peliculasID.concat(data.results.map((item) => item.id));
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

await cargarDatos();
console.log(peliculasID);

function JSONpelicula(titulo) {
  const pelicula = {
    Collecion: titulo.belongs_to_collection
      ? titulo.belongs_to_collection.id
      : null,
    Generos: titulo.genres?.map((genre) => genre.name).join(", ") || "",
    Id: titulo.id,
    Nombre:
      titulo.title ||
      titulo.name ||
      titulo.original_title ||
      titulo.original_name,
    Sinopsis:
      titulo.translations.translations
        .filter((item) => item.iso_639_1 === "es" && item.iso_3166_1 === "CO")
        .find((item) => item)?.data.overview ||
      titulo.translations.translations
        .filter((item) => item.iso_639_1 === "es" && item.iso_3166_1 === "MX")
        .find((item) => item)?.data.overview ||
      titulo.translations.translations
        .filter((item) => item.iso_639_1 === "es" && item.iso_3166_1 === "ES")
        .find((item) => item)?.data.overview ||
      titulo.overview,
    Lanzamiento:
      titulo.release_date?.split(/[-/]/).find((part) => part.length === 4) ||
      "No hay fecha de estreno",
    Duracion: titulo.runtime,
    Status: titulo.status,
    Tagline: titulo.tagline,

    Poster: titulo.poster_path,

    Tipo: "movie",

    Videos: titulo.videos?.results || [],
    Portada: titulo.backdrop_path,
    Creditos: titulo.credits?.cast || [],
    Proveedores:
      titulo["watch/providers"]?.results?.CO?.flatrate || "No disponible",
    Descripcion: titulo.overview,
  };
  peliculas.push(pelicula);
}

async function buscarDetalles(id) {
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
      if (data.belongs_to_collection) {
        coleccionID = data.belongs_to_collection.id;
      }
      JSONpelicula(data);
    }
  } catch (err) {
    console.error("Error al cargar datos:", err);
  }
}

await buscarDetalles(744);
console.log(coleccionID);
console.log(peliculas);
await buscarColeccion(coleccionID);

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
      await JSONcoleccion(data);
    }
  } catch (err) {
    console.error("Error al cargar datos:", err);
  }
}

async function JSONcoleccion(data) {
  coleccion = {
    Nombre: data.name,
    Lanzamiento: data.release_date || data.first_air_date,
    Poster: data.poster_path,
    Id: data.id,
    Duracion: data.runtime,
    Generos: data.genres?.map((genre) => genre.name).join(", ") || "",
    Portada: data.backdrop_path,
    Descripcion:
      data.translations.translations
        .filter((item) => item.iso_639_1 === "es" && item.iso_3166_1 === "CO")
        .find((item) => item)
        ?.data.overview.replace(/\\/g, "") ||
      data.translations.translations
        .filter((item) => item.iso_639_1 === "es" && item.iso_3166_1 === "MX")
        .find((item) => item)
        ?.data.overview.replace(/\\/g, "") ||
      data.translations.translations
        .filter((item) => item.iso_639_1 === "es" && item.iso_3166_1 === "ES")
        .find((item) => item)
        ?.data.overview.replace(/\\/g, "") ||
      data.overview.replace(/\\/g, ""),
  };
  console.log(coleccion);
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

function openTrailer() {
  const modal = document.getElementById("trailerModal");
  modal.style.display = "block"; // Muestra el modal
}

// Función para cerrar el modal
function closeTrailer() {
  const modal = document.getElementById("trailerModal");
  modal.style.display = "none";
}

document.addEventListener("DOMContentLoaded", function () {
  const movieItem = document.querySelector(".movie-item");
  movieItem.addEventListener("click", function () {
    openTrailer();
  });
  const closeBtn = document.querySelector(".close");
  closeBtn.addEventListener("click", closeTrailer);
});
