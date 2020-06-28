const { io } = require("../server");
const { Usuarios } = require("../classes/usuarios");
const { crearMensaje } = require("../utils/utils");

const usuarios = new Usuarios();

// escucha el evento "connect" enviado desde socket-chat.js
io.on("connection", (client) => {
    // escucha el evento "entrarChat" emitido desde socket-chat.js
    client.on("entrarChat", (data, callback) => {
        console.log(data);
        // devuelve un callback
        if (!data.nombre || !data.sala) {
            return callback({
                err: true,
                mensaje: "El nombre/sala es necesario",
            });
        }

        // unir a un usuario a una sala con .join(id)
        client.join(data.sala);

        // agregar una persona a la lista
        usuarios.agregarPersona(client.id, data.nombre, data.sala);

        // cuando una persona se conecta se lanza este evento
        // para todas las personas del mismo chat (envía todas las personas conectadas al chat)
        client.broadcast
            .to(data.sala)
            .emit("listaPersona", usuarios.getPersonasPorSala(data.sala));
        client.broadcast
            .to(data.sala)
            .emit("crearMensaje", crearMensaje("Admin", `${data.nombre} se unió`));

        callback(usuarios.getPersonasPorSala(data.sala));
    });

    // cuando un usuario envíe un mensaje se va para todos
    client.on("crearMensaje", (data, callback) => {
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit("crearMensaje", mensaje);

        callback(mensaje);
    });

    client.on("disconnect", () => {
        // cuando el usuario se desconecte se borra de la lista de conectados
        let personaBorrada = usuarios.borrarPersona(client.id);

        client.broadcast
            .to(personaBorrada.sala)
            .emit(
                "crearMensaje",
                crearMensaje("Admin", `${personaBorrada.nombre} salió`)
            );

        client.broadcast
            .to(personaBorrada.sala)
            .emit("listaPersona", usuarios.getPersonasPorSala(personaBorrada.sala));

        //TODO: tener en cuenta que cuando se recarga el navegador muy rapido
        // se está creando un nuevo usuario
    });

    // acciones que hace el servidor cuando un usuario manda
    // mensaje privado a otro
    client.on("mensajePrivado", (data) => {
        // la data debe contener el id de lapersona que envía
        let persona = usuarios.getPersona(client.id);
        // se envía un mensaje privado con broadcast.to(id_user)
        // data.para = id usuario receptor
        client.broadcast
            .to(data.para)
            .emit("mensajePrivado", crearMensaje(persona.nombre, data.mensaje));
    });
});