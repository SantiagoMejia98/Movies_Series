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
  container.className = "container";

  const content = document.createElement("div");
  content.className = "content";

  content.innerHTML = `
    <div class="background" 
      style="background-image: url('https://image.tmdb.org/t/p/original${
        datos.Portada[0]
      }');">
    </div>
    <div class="movie-card">
      <img class="poster" 
        src="https://image.tmdb.org/t/p/original${datos.Poster[0]}" alt="${
    datos.Nombre
  }">
      <div class="details">
        <h2>${datos.Nombre}</h2>
        <p>(${datos.Lanzamiento[0]} - ${
    datos.Lanzamiento[datos.Lanzamiento.length - 1]
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
  datos.Peliculas.forEach((pelicula) => {
    const li = document.createElement("li");
    li.className = "card";

    li.innerHTML = `
      <div class="pelicula-container" id="${pelicula.Id}">
        <img src="https://image.tmdb.org/t/p/original${pelicula.Poster}" alt="${pelicula.Nombre}">
        <h2><strong>${pelicula.Nombre}</strong></h2>
        <p class="lanzamiento">${pelicula.Lanzamiento}</p>
      </div>
      `;

    ul.appendChild(li);
  });

  coleccion.appendChild(ul);
  content.appendChild(coleccion);
  container.appendChild(content);
  elemento.appendChild(container);
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

  content.innerHTML = `
    <div class="background"
        style="background-image: url('https://image.tmdb.org/t/p/original${datos.Portada[0]}');">
    </div>
    <div class="logo-container">
        <img class="logo" src="https://image.tmdb.org/t/p/original${datos.Logo[0]}" alt="${datos.Nombre}">
    </div>
  `;

  const moviecard = document.createElement("div");
  moviecard.className = "movie-card";

  moviecard.innerHTML = `
    <img class="poster" src="https://image.tmdb.org/t/p/original${datos.Poster[0]}" alt="${datos.Nombre}"> 
    `;

  const details = document.createElement("div");
  details.className = "details";

  details.innerHTML = `
    <h2>${datos.Nombre} (${datos.Lanzamiento})</h2>
    <p>${datos.Generos} &bull; ${datos.Duracion} &bull; ${datos.Status}</p>
    <p><i>${datos.Tagline}</i></p> 
    <ul>
      <li class="movie-item">
        <img src="https://image.tmdb.org/t/p/original/pTnn5JwWr4p3pG8H6VrpiQo7Vs0.jpg">
        <p>Ver tráiler</p>
      </li>
    </ul>
    <div class="modal-content" id="trailerModal">
      <div class="close">&times;</div>
      <iframe class="trailer" id="trailerIframe"
        src="https://www.youtube.com/embed/${datos.Videos[0]}" frameborder="0" allowfullscreen>
      </iframe>
    </div>
    <h3>Sinopsis</h3>
    <p>${datos.Descripcion}</p>`;

  const proveedores = document.createElement("div");
  proveedores.className = "streaming-providers";

  proveedores.innerHTML = `
    <h3>Streaming on</h3>
  `;

  if (datos.Proveedores === "No disponible") {
    proveedores.innerHTML += `
      <p>${datos.Proveedores}</p>
    `;
  } else {
    const ulProvider = document.createElement("ul");
    ulProvider.className = "providers-list";

    datos.Proveedores.forEach((proveedor) => {
      const li = document.createElement("li");

      li.innerHTML = `
        <img src="https://image.tmdb.org/t/p/original${proveedor.logo_path}" alt="${proveedor.provider_name}">
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

  director.innerHTML = `<h3>Director</h3>`;

  const ulDirector = document.createElement("ul");
  ulDirector.className = "director-list";

  datos.Directores.forEach((director) => {
    const li = document.createElement("li");
    li.className = "director";

    li.innerHTML = `
        <img src="https://image.tmdb.org/t/p/original${director.Foto}" alt="${director.Nombre}">
        <p class="director-name">${director.Nombre}</p>
        `;

    ulDirector.appendChild(li);
  });

  director.appendChild(ulDirector);
  cardcast.appendChild(director);

  const cast = document.createElement("div");
  cast.className = "reparto";

  cast.innerHTML = `<h3>Reparto</h3>`;

  const ulCast = document.createElement("ul");
  ulCast.className = "cast-list";

  datos.Reparto.forEach((actor) => {
    const li = document.createElement("li");
    li.className = "actor";

    li.innerHTML = `
        <img src="https://image.tmdb.org/t/p/original${actor.Foto}" alt="${director.Nombre}">
        <p class="actor-name">${actor.Nombre}</p>
        <p>${actor.Personaje}</p>
        `;

    ulCast.appendChild(li);
  });

  cast.appendChild(ulCast);
  cardcast.appendChild(cast);
  moviecard.appendChild(cardcast);
  content.appendChild(moviecard);
  container.appendChild(content);
  elemento.appendChild(container);

  const movieItem = document.querySelector(".movie-item");
  movieItem.addEventListener("click", function () {
    openTrailer();
  });
  const closeBtn = document.querySelector(".close");
  closeBtn.addEventListener("click", closeTrailer);
}

function seleccionarElementosAleatorios(array) {
  const resultados = [];

  for (let i = 0; i < 1; i++) {
    const indiceAleatorio = Math.floor(Math.random() * array.length);
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
await buscarDetalles(seleccionarElementosAleatorios(peliculasID));

function JSONpelicula(titulo) {
  const pelicula = {
    Generos: titulo.genres?.map((genre) => genre.name).join(", ") || "",
    Id: titulo.id,
    Nombre:
      titulo.title ||
      titulo.name ||
      titulo.original_title ||
      titulo.original_name,
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
  return pelicula;
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
      const pelicula = JSONpelicula(data);
      console.log(pelicula);
      crearPelicula(elementos.pelicula, pelicula);
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
      coleccion = JSONcoleccion(data);
      crearColeccion(elementos.coleccion, coleccion);
    }
  } catch (err) {
    console.error("Error al cargar datos:", err);
  }
}

function JSONcoleccion(data) {
  coleccion = {
    Nombre: data.original_name || data.name,
    Lanzamiento: data.parts
      .map((item) =>
        item.release_date.split(/[-/]/).find((part) => part.length === 4)
      )
      .filter((year) => year)
      .sort(),
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
      .sort((a, b) => a.release_date - b.release_date)
      .map((item) => {
        return {
          Id: item.id,
          Nombre: item.original_title || item.title,
          Poster: item.poster_path,
          Lanzamiento:
            item.release_date
              ?.split(/[-/]/)
              .find((part) => part.length === 4) || "No hay fecha de estreno",
        };
      }),
  };
  return coleccion;
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
  modal.style.display = "block";
}

// Función para cerrar el modal
function closeTrailer() {
  const modal = document.getElementById("trailerModal");
  modal.style.display = "none";
}
