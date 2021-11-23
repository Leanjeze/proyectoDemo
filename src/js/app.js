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

    //almacena el nombre en el objeto
    nombreCita();

    //almacena la fecha
    fechaCita();

    //Deshabilita fecha anterior
    invFecha();

    //almacena la hora
    horaCita();
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

    // console.log(cita);
}
function agregarServicio(servicioObj) {
    const {servicios} = cita;

    cita.servicios = [...servicios, servicioObj];

    // console.log(cita);


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
        mostrarResumen();
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
    inNombre.textContent = '';
    inNombre.placeholder = "Tu Nombre";
    inNombre.classList.add('inpNombre');
    inNombre.setAttribute('id', 'nombre');

    const inFecha = document.createElement('INPUT');
    inFecha.type = "date";
    inFecha.textContent = '';
    inFecha.classList.add('inpFecha');
    inFecha.setAttribute('id', 'fecha');

    const inHora = document.createElement('INPUT');
    inHora.type = "time";
    inHora.textContent = '';
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

    // console.log(inNombre.textContent);
    // console.log(inFecha.textContent);
    // console.log(inHora.textContent);
}

function mostrarResumen(){
    //destructuring
    const {nombre, fecha, hora, servicios} = cita;

    //seleccinar el resumen
    const resumenDiv = document.querySelector('.contenido-resumen');

    //Limpiar el HTML previo
    while(resumenDiv.firstChild){
        resumenDiv.removeChild(resumenDiv.firstChild);
    }

    //validacion de objeto
    if (Object.values(cita).includes('')) {
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Faltan datos de Servicios, hora, fecha o nombre';

        noServicios.classList.add('invalidar-cita');

        //agregar a resumen
        resumenDiv.appendChild(noServicios);

        return;
    }

    const headingCita = document.createElement(`H3`);
    headingCita.textContent = `Resumen de Cita`;

    const nombreCita = document.createElement(`P`);
    nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`;

    const fechaCita = document.createElement(`P`);
    fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`;

    const horaCita = document.createElement(`P`);
    horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

    const serviciosCita = document.createElement(`DIV`);
    serviciosCita.classList.add(`resumen-servicios`);

    const headingServicios = document.createElement(`H3`);
    headingServicios.textContent = `Resumen de Servicios`;

    serviciosCita.appendChild(headingServicios);
    // Iterar sobre el arreglo de servicio

    let cantidad = 0;

    servicios.forEach(servicio =>{
        const {nombre, precio} = servicio;
    
        const contenedorServicio = document.createElement(`DIV`);
        contenedorServicio.classList.add(`contenedor-servicio`);

        const servicioTexto = document.createElement(`P`);
        servicioTexto.textContent = nombre;

        const servicioPrecio = document.createElement(`P`);
        servicioPrecio.textContent = precio;
        servicioPrecio.classList.add(`precio`);

        const totalServicio = precio.split(`$`);
        // console.log(parseInt(totalServicio[1].trim()));
        cantidad += parseInt(totalServicio[1].trim());
        //Colocar texto y precio en el div
        contenedorServicio.appendChild(servicioTexto);
        contenedorServicio.appendChild(servicioPrecio);

        serviciosCita.appendChild(contenedorServicio);
    });

    // console.log(cantidad);

    resumenDiv.appendChild(headingCita);
    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(fechaCita);
    resumenDiv.appendChild(horaCita);
    
    resumenDiv.appendChild(serviciosCita);

    const cantidadPagar = document.createElement(`P`);
    cantidadPagar.classList.add(`total`);
    cantidadPagar.innerHTML = `<span>Total: </span> $${cantidad}`;

    resumenDiv.appendChild(cantidadPagar);
}

function nombreCita(){
    const nombreInput = document.querySelector(`#nombre`);
    nombreInput.addEventListener(`input`, e => {
        const nombreTexto = e.target.value.trim();

        // console.log(nombreTexto)

        if(nombreTexto == `` || nombreTexto.length < 3){
            // console.log(`Nombre no valido`);
            mostrarAlerta(`Nombre no valido`, `error`);
        } else {
            //console.log(`Nombre valido`);
            const alerta = document.querySelector(`.alerta`);
            if(alerta){
                alerta.remove();
            }
            cita.nombre = nombreTexto;
        }
    });
}

function mostrarAlerta(mensaje, tipo) {
    // console.log(`el mensaje es`, mensaje);

    //Si hay una alerta previa no se manda a llamar
    const alertaPrevia = document.querySelector(`.alerta`);
    if(alertaPrevia){
        return;
    }

    const alerta = document.createElement(`DIV`);
    alerta.textContent = mensaje;
    alerta.classList.add(`alerta`);

    if(tipo === `error`){
        alerta.classList.add(`error`);
    }
    // console.log(alerta);
    //Insertar en el HTML
    const formulario = document.querySelector(`.formulario`);
    formulario.appendChild(alerta);

    //terminar alerta despues de 3seg

    setTimeout(() =>{
        alerta.remove();
    }, 3000)
}

function fechaCita(){
    const fechaInput = document.querySelector(`#fecha`);
    fechaInput.addEventListener(`input`,(e) =>{

        // console.log(e.target.value);
        const fechaTexto = new Date(e.target.value).getUTCDay();

        // console.log(cita);
        if([0,6].includes(fechaTexto)){
            e.preventDefault();
            fechaInput.value = ``; 
            mostrarAlerta(`Fines de semanas no valido`,`error`);
        } else {
            cita.fecha = fechaInput.value;

            // console.log(cita);
        }
    });
}

function invFecha(){
    const inputFecha = document.querySelector(`#fecha`);
    const fechaAhora = new Date ();
    const years = fechaAhora.getFullYear();
    const mes = fechaAhora.getMonth()+1;
    const dia = fechaAhora.getDate()+1;

    //Formato deseado AAAA-MM-DD
    const fechaDeshabilitar = `${years}-${mes}-${dia}`;
    inputFecha.min = fechaDeshabilitar;

    // console.log(fechaAhora);
}

function horaCita(){
    const inputHora = document.querySelector(`#hora`);
    inputHora.addEventListener(`input`,(e) =>{

        // console.log(e.target.value);
        const horaCita = e.target.value;
        const horaTexto = horaCita.split(`:`);

        // console.log(hora);
        if(horaTexto[0] < 10 || [0] > 18){
            mostrarAlerta(`Hora no valida`, `error`);
            setTimeout(() =>{
                inputHora.value = ``;
            }, 3000);
        }else{
            cita.hora = horaCita;
        }
    })
}
