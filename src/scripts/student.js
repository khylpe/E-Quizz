var socket = io();

socket.on('connect', function () {
       document.querySelector('button').addEventListener('click', function () {
              socket.emit('registered', document.querySelector('input').value);
       });
});

socket.on('disconnect', function () {
       console.log('Disconnected from server');
});

