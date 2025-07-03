const apiURL = "https://rickandmortyapi.com/api/episode"; //url que necesito de la API
const contenedor = document.getElementById("Episodios");
const titulo = document.getElementById("titulo")


/* manejo de BOTONES */

const prev = document.getElementById("btnPrev");
const sig = document.getElementById("btnSig");

/* variables globales */

let sigPag = null;
let prevPag = null;

/* funciones */

async function buscarEpisodios(url) {
  mostrarLoader();
  try {
    const response = await fetch(url);
    if (!response.ok) {
      contenedor.innerHTML = "<p>Error al cargar la API</p>";
      return;
    }
    const datos = await response.json();
    mostrarEpisodios(datos.results);

    sigPag = datos.info.next;
    prevPag = datos.info.prev;

    prev.disabled = !prevPag;
    sig.disabled = !sigPag;

    //muestro nuevamente los botones

    prev.style.display = "inline-block";
    sig.style.display = "inline-block";


  } catch (error) {
      contenedor.innerHTML = `<p>error al buscar los episodios. ${error.message}</p>`
  }finally{ocultarLoader();}//utilización del finally para dejar de mostrar el loader aunque falle
}

function mostrarEpisodios(episodios) {
  contenedor.innerHTML = "";
  episodios.forEach(epi => {
    const card = document.createElement("div");
    card.classList.add("episodio-card");
    card.innerHTML = `
      <h2>${epi.name}</h2>
      <p>📅 Fecha de emisión: ${epi.air_date}</p>
    `;

    card.addEventListener("click", () => mostrarPersonajesDelEpisodio(epi.characters, epi.name));

    contenedor.appendChild(card);
  });
}

async function mostrarPersonajesDelEpisodio(urlsPersonajes, nombreEpisodio) {
  contenedor.innerHTML = `<h2 class="titulo">Personajes en ${nombreEpisodio}</h2><p>Cargando personajes...</p>`;

  try {
    const personajes = await Promise.all( //me traigo todas las promesas de una vez, si falla 1 fallan todas.
      urlsPersonajes.map(url => fetch(url).then(res => res.json())) //mapeo y convierto a Json
    );

    // limpio y creo un contenedor para los personajes
    contenedor.innerHTML = `<h2 class="titulo">Personajes en ${nombreEpisodio}</h2><div id="contenedor-personajes"></div>`;

    const contenedorPersonajes = document.getElementById("contenedor-personajes");

    /* ocultar botones de navegacion */

    prev.style.display = "none";
    sig.style.display = "none";

    //creo las cards de los personajes ("miniportales")

    personajes.forEach(personaje => {
      const div = document.createElement("div");
      div.classList.add("personaje-card");
      div.innerHTML = `
  <a href="/detalles.html?id=${personaje.id}" class="personaje-card">
    <img src="${personaje.image}" alt="${personaje.name}" width="100" />
    <p>${personaje.name}</p>
  </a>
`;
      //agrego el hijo al contenedor padre
      contenedorPersonajes.appendChild(div);
    });

    // botón volver (tive que hacer esto porque sino ambas paginas estan relacionadas en el css y no me dejaba modificar lo que queria en la pagina de mostrar personajes del episodio)
    const volver = document.createElement("a");
    volver.textContent = "Volver a episodios";
    volver.classList.add("boton");
    volver.addEventListener("click", () => {
      buscarEpisodios(apiURL);
    });
    contenedor.appendChild(volver);

  } catch (error) {
    contenedor.innerHTML = `<p>Error al cargar los personajes: ${error.message}</p>`;
  }
}

/* creacion de funciones de loaders para la reutilizacion de los mismos */

function mostrarLoader() {
  document.getElementById("loader").style.display = "block";
}

function ocultarLoader() {
  document.getElementById("loader").style.display = "none";
}

/* listeners */

prev.addEventListener("click", () => buscarEpisodios(prevPag));
sig.addEventListener("click", () => buscarEpisodios(sigPag));

// inicial
buscarEpisodios(apiURL);
