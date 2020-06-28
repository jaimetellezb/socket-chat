// leer por parametros
//let params = new URLSearchParams(window.location.search);

//preguntar si viene el nombre
if (!params.has("nombre") || !params.has("sala")) {
    //sino viene el error se lanza error y redirecciona al index.html
    window.location = "index.html";
    throw new Error("El nombre o sala son necesarios");
}

// este es el usuario conectado
let usuario = {
    nombre: params.get("nombre"),
    sala: params.get("sala"),
};

// con este evento sabemos que un usuario se ha conectado
socket.on("connect", function() {
    console.log("Conectado al servidor");

    //indicar al backend quien ingresa y la clase socket.js (del servidor)
    // escucha este evento
    socket.emit("entrarChat", usuario, function(resp) {
        // respuesta del servidor
        //console.log("Los usuarios conectados", resp);
        renderizarUsarios(resp);
    });
});

// escuchar
socket.on("disconnect", function() {
    console.log("Perdimos conexión con el servidor");
});

// Escuchar información
socket.on("crearMensaje", function(mensaje) {
    //console.log("Servidor:", mensaje);
    renderizarMensaje(mensaje, false);
    scrollBottom();
});

// escuchar cuando un usaurio entra o sale del chat
socket.on("listaPersona", function(personas) {
    console.log(personas);
    renderizarUsarios(personas);
});

// escuchar por parte del cliente mensajes privados
socket.on("mensajePrivado", function(mensaje) {
    console.log(mensaje);
});