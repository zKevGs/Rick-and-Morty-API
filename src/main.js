// URL de la api
// document.getElementById('contenedorPersonajes')

const apiURL = "https://rickandmortyapi.com/api/character";
const contenedor = document.getElementById("contenedorPersonajes");

//buqueda

const busqueda = document.getElementById("inputBusqueda");
const filtro = document.getElementById("filtro");

//paginación

const prev = document.getElementById("btnPrev");
const sig = document.getElementById("btnSig");
const paginaActual = document.getElementById("paginaActual");

//variables globales

  let  sigPag = null;
  let  prevPag = null;

/* FUNCIONES */

// async function buscarPersonajes
//    try
//      fetch
//      .json
//    catch
//      console.log error



async function buscarPersonajes(url) {

      contenedor.innerHTML = `<p>Cargando...</p>`; // mostramos el loader

      try{

        const response = await fetch(url); //hago la peticion http y hago la promise

      if(!response.ok){ //si la respuesta es distinta a ok muestro este mensaje, ya que significa que la api no pudo ser cargada
               contenedor.innerHTML = `<p>error al cargar la API/Personaje no encontrado</p>`;
               return;
            }
       const datos = await response.json(); //pasamos la respuesta a Json
        console.log(datos);
        mostrarPersonajes(datos.results) //le damos los datos a la funcion mostrarPersonajes

          //paginacion

        const numeroPagina = obtenerNumeroPagina(url);
        paginaActual.textContent = `Página ${numeroPagina}`;

        sigPag = datos.info.next;
        prevPag = datos.info.prev;

        //no dejar usar botones si no existen(ej, el prev en la pag 1)

        prev.disabled = !prevPag;
        sig.disabled = !sigPag;

    }
    catch(error){
      contenedor.innerHTML = `<p>error al mostrar los Personajes. ${error.message}</p>`
    }
}

//function mostrarpersonajes(personajes)
// limpio
//recorro
//creo un nuevo elemento
//le doy data
//agrego el hijo al elemento padre

function mostrarPersonajes(personajes){
    contenedor.innerHTML = "" //limpio antes de renderizar


    personajes.forEach(personaje => { //recorro los personajes
        const card = document.createElement("div") //creo el div para meter adentro los atributos de los personajes
        //le metemos la data de la Api a la card
        card.innerHTML =`
        <img src="${personaje.image}" alt="${personaje.name}"/>
        <h2>👤${personaje.name}</h2>
        <p>💀status: ${personaje.status}</p>
        <a href="/detalles.html?id=${personaje.id}">Ver detalles</a>
        `;
        contenedor.appendChild(card);

    });
}

function actualizarBusqueda(){
const texto = busqueda.value; //guardo el valor del input en una constante
const estado = filtro.value; //lo mismo con el filtro
let url = "https://rickandmortyapi.com/api/character/"; //guardo la url

if(texto || estado){ //pregunto si existe un texto o un estado
  url += "?"; // le asigno un ? a la url para poder realizar las busquedas
  if(texto){
    url += `name=${texto}`; //busqueda por el nombre
  }
  if(estado){
    if(texto) url += `&`; //a la url le agrego un & para poder usar el filtro
    url += `status=${estado}`; //busco por el filtro seleccionado
  }
}
buscarPersonajes(url) //llamo a la funcion
}

function obtenerNumeroPagina(url) {
  if(!url) return null; //si no existe una URL retorno Null
  const params = new URL(url).searchParams; //manejo los datos despues del ?
  return params.get("page") || 1; //esto me permite retornar el numero de la pagina para poder mostrarlo al final de la misma.
}



/* eventos */


//agrego un evento para que se muestren los resultados de forma dinamica a la hora de seleccionar un filtro o escribir un nombre
busqueda.addEventListener("keyup", actualizarBusqueda);
filtro.addEventListener("change", actualizarBusqueda);

/* ordenamiento */
//intenté hacer este ordenamiento, pero al cargarme los datos de la api no podia ordenarlos de la A-Z
//y viceversa, ya que esta solo me mostrama los datos filtrados de la pagina cargada, no me filtraba
//todas las paginas como yo quería. Y estuve investigando pero no encontré alguna funcion de la API
//en si que me deje cargarla toda para reenderizarla como yo queria :/

/*
const buttom = document.getElementById("Ordenamiento");

  let  ordenAscendente = true;

if(ordenAscendente){
    personajes.sort((a, b) => a.name.localeCompare(b.name));
} else {
    personajes.sort((a, b) => b.name.localeCompare(a.name));
}

function ordenarpersonajes(){
  ordenAscendente = !ordenAscendente;
  actualizarBusqueda();
  buttom.textContent= ordenAscendente ? "Ordenar A-Z" : "Ordenar Z-A";
}

buttom.addEventListener("click", ordenarpersonajes); */

//paginacion
prev.addEventListener("click", () => {buscarPersonajes(prevPag)});
sig.addEventListener("click", () => {buscarPersonajes(sigPag)});

//inicializamos
actualizarBusqueda();

//cual es la mejor manera de que el codigo se vea mejor? de la forma que aplique ahora(todo junto y ordenado)
//o que cada listener este cerca de la funcion que usa, cada getelement cerca de la funcion que lo va a utilizar, etc