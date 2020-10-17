var socket = io();

let params = new URLSearchParams(window.location.search);

if (!params.has('name') || !params.has('room')) {
    window.location = 'index.html';
    throw new Error('The name and room is necessary');
}

let user = {
    name: params.get('name'),
    room: params.get('room')
}

socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('enterChat', user, function(resp) {
        // console.log('User conect in room', resp);
        renderUser(resp);
    });
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
// socket.emit('enviarMensaje', {
//     usuario: 'Fernando',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });

//Escuchar información
socket.on('personDisconnect', function(mensaje) {
    console.log('Server:', mensaje);
});

socket.on('createMessage', function(message) {
    // console.log('Server:', mensaje);
    renderMessages(message, false);
    scrollBottom();
});

socket.on('personsConnect', (persons) => {
    renderUser(persons);
});


//Mesanes privados

socket.on('privateMessage', (message) => {
    console.log('Mensaje privado', message);
});