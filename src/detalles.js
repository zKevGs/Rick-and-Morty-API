const params = new URLSearchParams(window.location.search); //tomo la URL
const id = params.get("id");//agarro lo que me interesa de la url, en este caso el ID para mostrar los detalles de este PJ
const contenedor = document.getElementById("detallesPersonaje");


async function obtenerDetallePersonaje(id) {

mostrarLoader();

      try{

       let url = `https://rickandmortyapi.com/api/character/${id}`;//url con el id que quiero ver los detalles

       const response = await fetch(url)

       if(!response.ok){
               contenedor.innerHTML = `<p>error al cargar la API/Personaje no encontrado</p>`;
           return;
        }

        const data = await response.json();

        contenedor.innerHTML = "" //limpio antes de renderizar

        //le agrego la data a la nueva card

        contenedor.innerHTML =`
        <img src="${data.image}" alt="${data.name}" />
            <h2>👤${data.name}</h2>
        <p><strong>💀Estado:</strong> ${data.status}</p>
        <p><strong>🧬Especie:</strong> ${data.species}</p>
        <p><strong>⚧️Género:</strong> ${data.gender}</p>
        <p><strong>🌍Origen:</strong> ${data.origin.name}</p>
        <p><strong>📍Ubicación actual:</strong> ${data.location.name}</p>
        `

   }catch(error){
          contenedor.innerHTML = `<p>error al mostrar los personajes. ${error.message}</p>` //manejo errores
   }
   finally{ocultarLoader();}
}

function mostrarLoader() {
  document.getElementById("loader").style.display = "block";
}

function ocultarLoader() {
  document.getElementById("loader").style.display = "none";
}

//inicializo
obtenerDetallePersonaje(id);
