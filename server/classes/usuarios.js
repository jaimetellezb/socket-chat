/**
 * Clase que va administrar todos los usuarios conectados en el chat
 */
class Usuarios {
    constructor() {
        this.personas = [];
    }

    agregarPersona(id, nombre, sala) {
        let persona = { id, nombre, sala };

        // agrega la persona a la lista de personas
        this.personas.push(persona);

        return this.personas;
    }

    getPersona(id) {
        let persona = this.personas.filter((per) => per.id === id)[0];

        return persona;
    }

    getPersonas() {
        return this.personas;
    }

    getPersonasPorSala(sala) {
        let personasEnSala = this.personas.filter(
            (persona) => persona.sala === sala
        );

        return personasEnSala;
    }

    borrarPersona(id) {
        let personaBorrada = this.getPersona(id);
        // devuelve un arreglo sin la persona borrada
        this.personas = this.personas.filter((per) => per.id !== id);

        return personaBorrada;
    }
}

module.exports = {
    Usuarios,
};