// Configuración inicial de la API de TMDb
const API_KEY = "30e140fc724d591c3001be4484882712"; // Reemplaza con tu clave API de TMDb
const BASE_URL = "https://api.themoviedb.org/3";
let SESSION_ID = localStorage.getItem("session_id") || ""; // Recuperar session_id almacenado
const ACCOUNT_ID = "21500820"; // Reemplaza con tu account_id obtenido

// Mapea los elementos DOM que desea actualizar
const elementos = {
    peliculas: document.querySelector('[data-name="peliculas"]'),
    series: document.querySelector('[data-name="series"]'),
    pelicula: document.querySelector('[data-name="pelicula"]'),
    serie: document.querySelector('[data-name="serie"]')
};

// Función para consultar la API de TMDb
async function consultarAPI(endpoint, params = {}) {
    const url = new URL(`${BASE_URL}${endpoint}`);
    params.api_key = API_KEY;
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Error al consultar la API de TMDb");
        return await response.json();
    } catch (error) {
        console.error(error);
    }
}

// Función para verificar si el session_id es válido
async function verificarSessionID() {
    if (!SESSION_ID) {
        console.log("No se encontró session_id, generando uno nuevo.");
        await obtenerSessionID();
    } else {
        try {
            const data = await consultarAPI("/account", { session_id: SESSION_ID });
            if (data && data.id) {
                console.log("session_id válido");
            } else {
                console.log("session_id inválido, generando uno nuevo.");
                await obtenerSessionID();
            }
        } catch (error) {
            console.log("Error al verificar session_id, generando uno nuevo.");
            await obtenerSessionID();
        }
    }
}

// Función para generar un nuevo session_id
async function obtenerSessionID() {
    try {
        // Paso 1: Obtener request_token
        const tokenResponse = await consultarAPI("/authentication/token/new");
        const requestToken = tokenResponse.request_token;

        // Paso 2: Autenticar manualmente
        alert(`Autoriza el acceso en este enlace y luego regresa: https://www.themoviedb.org/authenticate/${requestToken}`);

        // Paso 3: Convertir request_token en session_id
        const sessionResponse = await consultarAPI("/authentication/session/new", {
            request_token: requestToken
        });

        SESSION_ID = sessionResponse.session_id;
        localStorage.setItem("session_id", SESSION_ID);
        console.log("Nuevo session_id generado y almacenado");
    } catch (error) {
        console.error("Error al generar session_id", error);
    }
}

// Función para buscar películas o series
async function buscarMedia(tipo, query) {
    const endpoint = tipo === "movie" ? "/search/movie" : "/search/tv";
    const data = await consultarAPI(endpoint, { query });
    return data.results || [];
}

// Función para cargar la watchlist
async function cargarWatchlist(tipo) {
    const endpoint = `/account/${ACCOUNT_ID}/watchlist/${tipo}`;
    const data = await consultarAPI(endpoint, { session_id: SESSION_ID });
    return data.results || [];
}

// Función para agregar o quitar elementos de la watchlist
async function modificarWatchlist(mediaId, tipo, agregar) {
    const endpoint = `/account/${ACCOUNT_ID}/watchlist`;
    const body = {
        media_type: tipo,
        media_id: mediaId,
        watchlist: agregar
    };

    try {
        const response = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}&session_id=${SESSION_ID}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const result = await response.json();
        console.log(result.status_message);
    } catch (error) {
        console.error("Error al modificar la watchlist", error);
    }
}

// Función para crear la lista de tarjetas (cards)
function crearListaMedia(elemento, datos, tipo) {
    const ul = document.createElement('ul');
    ul.className = 'lista';

    datos.forEach(item => {
        const li = document.createElement('li');
        li.className = 'card';

        li.innerHTML = `
            <div class="media-container">
                <h2 class="titulo">${item.title || item.name}</h2>
                <img src="https://image.tmdb.org/t/p/w500${item.poster_path}" alt="${item.title || item.name}">
                <div class="informacion">
                    <p><strong>Fecha:</strong> ${item.release_date || item.first_air_date}</p>
                    <p><strong>Calificación:</strong> ${item.vote_average}</p>
                </div>
                <button class="watchlist-btn">${tipo === "add" ? "Agregar" : "Eliminar"} de Watchlist</button>
            </div>
        `;

        li.querySelector('.watchlist-btn').addEventListener('click', () => {
            modificarWatchlist(item.id, item.media_type || tipo, tipo === "add");
        });

        ul.appendChild(li);
    });

    elemento.innerHTML = ""; // Limpiar contenido previo
    elemento.appendChild(ul);
}

// Función para manejar la selección del menú
async function manejarSeleccion(event) {
    const valorSeleccionado = event.target.value;
    switch (valorSeleccionado) {
        case 'peliculas':
            const peliculas = await cargarWatchlist("movies");
            crearListaMedia(elementos.peliculas, peliculas, "remove");
            break;
        case 'series':
            const series = await cargarWatchlist("tv");
            crearListaMedia(elementos.series, series, "remove");
            break;
        case 'pelicula':
        case 'serie':
            const tipo = valorSeleccionado === "pelicula" ? "movie" : "tv";
            const busqueda = await buscarMedia(tipo, "random");
            crearListaMedia(elementos[valorSeleccionado], busqueda, "add");
            break;
    }
}

// Añadir event listener al menú desplegable
document.getElementById('dropdown-menu').addEventListener('change', manejarSeleccion);

// Verificar session_id al iniciar la aplicación
verificarSessionID();