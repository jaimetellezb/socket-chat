var socket = io();

// leer por parametros
let params = new URLSearchParams(window.location.search);

let nombre = params.get("nombre");
let sala = params.get("sala");

// referencias de jQuery
let divUsuarios = $("#divUsuarios");
let formEnviar = $("#formEnviar");
let txtMensaje = $("#txtMensaje");
let divChatbox = $("#divChatbox");

// funciones para renderizar usuarios
function renderizarUsarios(personas) {
    console.log(personas);

    let html = "";

    html += "<li>";
    html +=
        '    <a href="javascript:void(0)" class="active"> Chat de <span> ' +
        params.get("sala") +
        "</span></a>";
    html += "</li>";

    for (let i = 0; i < personas.length; i++) {
        html += "<li>";
        html +=
            '<a data-id="' +
            personas[i].id +
            '" href="javascript:void(0)"><img src="assets/images/users/profile1.png" alt="user-img" class="img-circle"> <span>' +
            personas[i].nombre +
            ' <small class="text-success">online</small></span></a>';
        html += "</li>";
    }

    divUsuarios.html(html);
}

function renderizarMensaje(mensaje, yo) {
    console.log("MENSAJE", mensaje);
    let html = "";
    let fecha = new Date(mensaje.fecha);
    let hora = fecha.getHours() + ":" + fecha.getMinutes();

    let adminClass = "info";
    if (mensaje.nombre === "Admin") {
        adminClass = "danger";
    }
    if (yo) {
        html += '<li class="reverse">';
        html += '<div class="chat-content">';
        html += "<h5>" + mensaje.nombre + "</h5>";
        html += '<div class="box bg-light-inverse">' + mensaje.mensaje;
        html += "</div>";
        html += "</div>";
        html += '<div class="chat-img">';
        html += '<img src="assets/images/users/profile1.png" alt="user" />';
        html += "</div>";
        html += '<div class="chat-time">' + hora + "</div>";
        html += "</li>";
    } else {
        html += '<li class="animated fadeIn">';
        if (mensaje.nombre !== "Admin") {
            html += '<div class="chat-img">';
            html += '<img src="assets/images/users/profile2.png" alt="user" />';
            html += "</div>";
        }

        html += '<div class="chat-content">';
        html += "<h5>" + mensaje.nombre + "</h5>";
        html += '<div class="box bg-light-' + adminClass + '">' + mensaje.mensaje;
        html += "</div>";
        html += "</div>";
        html += '<div class="chat-time">' + hora + "</div>";
        html += "</li>";
    }

    divChatbox.append(html);
}

function scrollBottom() {
    // selectors
    var newMessage = divChatbox.children("li:last-child");

    // heights
    var clientHeight = divChatbox.prop("clientHeight");
    var scrollTop = divChatbox.prop("scrollTop");
    var scrollHeight = divChatbox.prop("scrollHeight");
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (
        clientHeight + scrollTop + newMessageHeight + lastMessageHeight >=
        scrollHeight
    ) {
        divChatbox.scrollTop(scrollHeight);
    }
}

//listeners
// cuando se haga clic en cualquier tag dentro del div
divUsuarios.on("click", "a", function() {
    // el this de jQuery hace referencia al elemento seleccionado
    // el id hace referencia al id que se puso en la etiqueta '<a data-id="'
    let id = $(this).data("id");

    if (id) {
        console.log(id);
    }
});

//formulario
formEnviar.on("submit", function(event) {
    // este evento hace que cuando se de enter no se ejecute el submit
    event.preventDefault();

    if (txtMensaje.val().trim().length === 0) {
        return;
    }

    socket.emit(
        "crearMensaje", {
            nombre: nombre,
            mensaje: txtMensaje.val(),
        },
        function(mensaje) {
            // limpia el texto y focus apra mantenerse ahí
            txtMensaje.val("").focus();
            renderizarMensaje(mensaje, true);
            scrollBottom();
        }
    );
});