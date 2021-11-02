let pagina = 1;

document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
});

function iniciarApp() {
    mostrarServicios();

    //resalta el Div Actual
    mostrarSeccion();

    //Oculta o muestra una seccion
    cambiarSeccion();

    //Pagina siguiente y anterior
    paginaSiguiente();

    paginaAnterior();

    //Datos
    datosElemet();
}

function mostrarSeccion(){
    seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    //resalta el Tab Actual
    const tab = document.querySelector(`[data-paso= "${pagina}"]`);
    tab.classList.add('actual');
}
function cambiarSeccion(){
    const enlaces = document.querySelectorAll('.tabs button');

    enlaces.forEach( enlace => {
        enlace.addEventListener('click', e =>{
            e.preventDefault();

            pagina = parseInt(e.target.dataset.paso);

            //Eliminar mostrar-seccion de la secciona anterior
            document.querySelector('.mostrar-seccion').classList.remove('mostrar-seccion');

            //Agrega mostrar-seccion donde dimos click

            const seccion = document.querySelector(`#paso-${pagina}`);
            seccion.classList.add('mostrar-seccion');

            //Elimina la clase de actual en el tab anterior
            document.querySelector('.tabs .actual').classList.remove('actual');

            //Agrega la clase de actual en el nuevo tab
            const tab = document.querySelector(`[data-paso= "${pagina}"]`);
            tab.classList.add('actual');
        })
    })
}

async function mostrarServicios() {
    try {
        const resultado = await fetch('./servicios.json')
        const db = await resultado.json();

        const {servicios} = db;

        //GENERAR EL HTML
        servicios.forEach( servicio =>{
            const {id, nombre, precio} = servicio;

            //DOM Scripting
            //Generar nombre de servicio
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');

            //Generar Precio del servicio
            const precioServicio = document.createElement('P');
            precioServicio.textContent = `$ ${precio}`;
            precioServicio.classList.add('precio-servicio');

            //Generar div contenedor de servicio
            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');
            servicioDiv.dataset.idServicio = id;

            //Selecciona un servicio para la cita
            servicioDiv.onclick = seleccionarServicio;

            //Inyectar precio y nombre al div de servicio
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);

            //Inyectarlo en el HTML
            document.querySelector('#servicios').appendChild(servicioDiv);
        });
    } catch (error) {
        console.log(error);
    }
}

function seleccionarServicio(e) {

    let elemento;
    // Forzar que el elemento al cual le damos click sea el DIV
    if(e.target.tagName = 'P'){
        elemento = e.target.parentElement;
    } else {
        elemento = e.target;
    }

    if(elemento.classList.contains('seleccionado')){
        elemento.classList.remove('seleccionado');
    } else {
        elemento.classList.add('seleccionado');
    }

};

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector(`#siguiente`)
    paginaSiguiente.addEventListener(`click`, () =>{
        pagina++;


    })
}
function paginaAnterior() {
    const paginaAnterior = document.querySelector(`#anterior`)
    paginaAnterior.addEventListener(`click`, () =>{
        pagina--;


    })
}
function datosElemet() {

    //String para nombre cita.
    const nombreD = `Nombre`,
        fechaD = `Fecha`,
        horaD = `Hora`;

    //Creamos un parrafo para el nombre cita.
    const dNombre = document.createElement('P');
    dNombre.textContent = nombreD;
    dNombre.classList.add('nombre-Datos');

    const dFecha = document.createElement('P');
    dFecha.textContent = fechaD;
    dFecha.classList.add('fecha-Datos');

    const dHora = document.createElement('P');
    dHora.textContent = horaD;
    dHora.classList.add('hora-Datos');

    const inNombre = document.createElement('INPUT');
    inNombre.type = "nombre";
    inNombre.classList.add('inpNombre');

    const inFecha = document.createElement('INPUT');
    inFecha.type = "date";
    inFecha.classList.add('inpFecha');

    const inHora = document.createElement('INPUT');
    inHora.type = "time";
    inHora.classList.add('inpHora');


    //Lo inyectamos al HTML.
    const datosDiv = document.querySelector('#datos')
    datosDiv.appendChild(dNombre);
    datosDiv.appendChild(inNombre);

    datosDiv.appendChild(dFecha);
    datosDiv.appendChild(inFecha);

    datosDiv.appendChild(dHora);
    datosDiv.appendChild(inHora);
}