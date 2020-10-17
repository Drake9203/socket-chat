// funcionaes para renderizar usuarios
let param = new URLSearchParams(window.location.search);

let name = param.get('name');
let room = param.get('room');

// Referencias Jquery
let divUsers = $('#divUsers');
let formSend = $('#formSend');
let txtMessage = $('#txtMessage');
let divChatbox = $('#divChatbox');

function renderUser(persons) {
    let html = '';
    html += '<li>';
    html += '<a href = "javascript:void(0)"class = "active"> Chat de <span>' + room + '</span></a>';
    html += '</li>';

    for (i = 0; i < persons.length; i++) {
        html += '<li>';
        html += '<a data-id="' + persons[i].id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + persons[i].name + '<small class="text-success">online</small></span></a>';
        html += '</li>';
    }

    divUsers.html(html);
}

function renderMessages(message, me) {
    let html = '';
    let date = new Date(message.date);
    let hours = date.getHours() + ':' + date.getMinutes();

    let adminClass = 'info';

    if (message.name === 'Admin') {
        adminClass = 'danger';
    }

    if (me) {
        html += '<li class="reverse">';
        html += '<div class="chat-content">';
        html += '<h5>' + message.name + '</h5>';
        html += '<div class="box bg-light-inverse">' + message.message + '</div>';
        html += '</div>';
        html += '<div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '<div class="chat-time">' + hours + '</div>';
        html += '</li>';
    } else {
        html += '<li class="animated fadeIn">';
        if (message.name !== 'Admin') {
            html += '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        }
        html += '<div class="chat-content">';
        html += '<h5>' + message.name + '</h5>';
        html += '<div class="box bg-light-' + adminClass + '">' + message.message + '</div>';
        html += '</div>';
        html += '<div class="chat-time">' + hours + '</div>';
        html += '</li>';
    }

    divChatbox.append(html);
}

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

//Listeners

divUsers.on('click', 'a', function() {
    let id = $(this).data('id');
    console.log(id);
});

formSend.on('submit', function(e) {
    e.preventDefault();

    if (txtMessage.val().trim().length === 0) {
        return;
    }

    socket.emit('createMessage', {
        name: name,
        message: txtMessage.val()
    }, function(message) {
        txtMessage.val('').focus();
        renderMessages(message, true);
        scrollBottom();
    });
});