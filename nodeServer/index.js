// Node server which will handle socket io connections
const io = require('socket.io')(8000);


const users = {};

io.on('connection', socket =>{
    // If any new users join, let others users connected to know.
    socket.on('new-user-joined', name =>{
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });




    // If any user typing a message, broadcast to other users.
    socket.on("typing", (name) => {
        socket.broadcast.emit('typing', name);
    });




    // If any user send a message, broadcast to other users.
    socket.on('send', message =>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]});
    });



    // If any user leaves the chat, let others know.
    socket.on('disconnect', message =>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });

});
