
const socket = io('http://localhost:8000', {transports: ['websocket', 'polling', 'flashsocket']});




// Get DOM elements in respective Js variables.
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
const feedback = document.getElementById('feedback');



// Audio that will play on receiving messages.
var audio = new Audio('message-tone.mp3');


// Function which will append event info to the container.
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left'){
        audio.play();
    }
};


// Ask new user for his/her name and let the server know. 
const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);

// if a new user joins, receive his/her name from the server.
socket.on('user-joined', name =>{
    append(`${name}: joined the chat`, 'right')
});


// if server sends a message, receive it.
socket.on('receive', data =>{
    append(`${data.name}: ${data.message}`, 'left') 
    messageContainer.scrollTop = messageContainer.scrollHeight;
}); 

// if a user leaves the chat, append the info to the container
socket.on('left', name =>{
    append(`${name}: Left the chait`, 'left')  
});

// if the form gets submitted, send server the message.
form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`you: ${message}`, 'right')
    socket.emit('send', message)
    messageInput.value = ''
    messageContainer.scrollTop = messageContainer.scrollHeight;
});


// if the user typing the message, send server the message.
form.addEventListener("keypress", () => {
    socket.emit("typing", name);
});

socket.on("typing", (name) =>{
    feedback.innerHTML = `<p><em>${name}: is typing...</em></p>`;
    setTimeout(() => {
        feedback.innerHTML = "";
    }, 3000);
});

