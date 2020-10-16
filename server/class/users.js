class Users {

    constructor() {
        this.persons = [];
    }

    addPerson(id, name, room) {
        let person = {
            id,
            name,
            room
        };

        this.persons.push(person);
        return this.persons;
    }

    getPersonById(id) {
        let person = this.persons.filter(p =>
            p.id === id
            // se pone el 0 para que traiga solo la primera posicion
        )[0];
        return person;
    }

    getAllPersons() {
        return this.persons;
    }

    getPersonByRoom(room) {
        let personsInRoom = this.persons.filter(p => p.room === room);
        return personsInRoom;
    }

    deletePerson(id) {
        let deletePerson = this.getPersonById(id);
        this.persons = this.persons.filter(p => p.id != id);
        return deletePerson;
    }

}

module.exports = { Users };