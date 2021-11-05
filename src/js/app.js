let pagina = 1;

const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

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

    //Comprueba la pagina actual para ocultar o mostrar la paginacion

    botonesPaginador();

    //Datos
    datosElemet();

    //Muestra el resumen de la cita o el error
    mostrarResumen();
}

function mostrarSeccion(){

    //Eliminar mostrar-seccion de la secciona anterior
    const seccionM = document.querySelector('.mostrar-seccion')
    if(seccionM){
        seccionM.classList.remove('mostrar-seccion')
    }

    seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    //Elimina la clase de actual en el tab anterior
    const tabA = document.querySelector('.tabs .actual');
    if(tabA){
        tabA.classList.remove('actual')
    }
    
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

            mostrarSeccion();
            botonesPaginador();
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
            const servicioDiv = document.createElement('LABEL');
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

        const id = parseInt(elemento.dataset.idServicio);
        // console.log(id);
        eliminarServicio(id);

    } else {
        elemento.classList.add('seleccionado');
     
        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent
        }
        // console.log(servicioObj);
        agregarServicio(servicioObj);
    }

    
};

function eliminarServicio(id) {
    //Destructuring
    const {servicios} = cita;

    //Agregamos la funcion para eliminar (FILTER)
    cita.servicios = servicios.filter(servicio =>servicio.id !== id);

    console.log(cita);
}
function agregarServicio(servicioObj) {
    const {servicios} = cita;

    cita.servicios = [...servicios, servicioObj];

    console.log(cita);
}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector(`#siguiente`);
    paginaSiguiente.addEventListener(`click`, () =>{
        pagina++;

        botonesPaginador();
    })
}
function paginaAnterior() {
    const paginaAnterior = document.querySelector(`#anterior`);
    paginaAnterior.addEventListener(`click`, () =>{
        pagina--;

        botonesPaginador();
    })
}

function botonesPaginador(){
    const paginaSiguiente = document.querySelector(`#siguiente`);
    const paginaAnterior = document.querySelector(`#anterior`);

    if(pagina === 1){
        paginaAnterior.classList.add(`ocultar`);
        paginaSiguiente.classList.remove(`ocultar`);
    } else if (pagina === 3){
        paginaSiguiente.classList.add(`ocultar`);
        paginaAnterior.classList.remove(`ocultar`);
    } else {
        paginaSiguiente.classList.remove(`ocultar`);
        paginaAnterior.classList.remove(`ocultar`);
    }
    mostrarSeccion();
}

function datosElemet() {

    //String para nombre cita.
    const nombreD = `Nombre`,
        fechaD = `Fecha`,
        horaD = `Hora`;

    //Creamos un parrafo para el nombre cita.
    const dNombre = document.createElement('LABEL');
    dNombre.textContent = nombreD;
    dNombre.setAttribute('for', 'nombre');
    dNombre.classList.add('nombre-Datos');

    const dFecha = document.createElement('LABEL');
    dFecha.textContent = fechaD;
    dFecha.setAttribute('for', 'fecha');
    dFecha.classList.add('fecha-Datos');

    const dHora = document.createElement('LABEL');
    dHora.textContent = horaD;
    dHora.setAttribute('for', 'hora');
    dHora.classList.add('hora-Datos');

    const inNombre = document.createElement('INPUT');
    inNombre.type = "nombre";
    inNombre.placeholder = "Tu Nombre";
    inNombre.classList.add('inpNombre');
    inNombre.setAttribute('id', 'nombre');

    const inFecha = document.createElement('INPUT');
    inFecha.type = "date";
    inFecha.classList.add('inpFecha');
    inFecha.setAttribute('id', 'fecha');

    const inHora = document.createElement('INPUT');
    inHora.type = "time";
    inHora.classList.add('inpHora');
    inHora.setAttribute('id', 'hora');


    //Lo inyectamos al HTML.
    const datosDiv = document.querySelector('#datos')
    datosDiv.appendChild(dNombre);
    datosDiv.appendChild(inNombre);

    datosDiv.appendChild(dFecha);
    datosDiv.appendChild(inFecha);

    datosDiv.appendChild(dHora);
    datosDiv.appendChild(inHora);
}

function mostrarResumen(){
    //destructuring
    const {nombre, fecha, hora, servicios} = cita;

    //seleccinar el resumen
    const resumenDiv = document.querySelector('.contenido-resumen');

    //validacion de objeto
    if (Object.values(cita).includes('')) {
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Faltan datos de Servicios, hora, fecha o nombre';

        noServicios.classList.add('invalidar-cita');

        //agregar a resumen
        resumenDiv.appendChild(noServicios);
    }
}