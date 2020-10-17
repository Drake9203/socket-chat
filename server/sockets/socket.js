const { io } = require('../server');
const { Users } = require('../class/users');
const { createMessage } = require('../utils/utils');

const users = new Users();

io.on('connection', (client) => {
    client.on('enterChat', (user, callback) => {

        if (!user.name || !user.room) {
            return callback({
                status: false,
                message: 'The name and room is require'
            });
        }

        client.join(user.room);

        users.addPerson(client.id, user.name, user.room);
        client.broadcast.to(user.room).emit('personsConnect', users.getPersonByRoom(user.room));
        client.broadcast.to(user.room).emit('createMessage', createMessage('Admin',
            `${user.name} se unio`));
        callback(users.getPersonByRoom(user.room));
    });


    client.on('createMessage', (data, callback) => {
        let person = users.getPersonById(client.id)
        let message = createMessage(person.name, data.message);
        client.broadcast.to(person.room).emit('createMessage', message);
        callback(message);
    });


    client.on('disconnect', () => {
        let personDelete = users.deletePerson(client.id);
        client.broadcast.to(personDelete.room).emit('createMessage', createMessage('Admin',
            `${personDelete.name} abandono el chat`));
        client.broadcast.to(personDelete.room).emit('personsConnect', users.getPersonByRoom(personDelete.room));
    });


    // Mensaje privado

    client.on('privateMessage', (data) => {

        let person = users.getPersonById(client.id);
        // data.to es el id del usuario al que se le va enviar el mensaje se puede poner cualqier nombre
        client.broadcast.to(data.to).emit('privateMessage', createMessage(person.name, data.message));

    });

});