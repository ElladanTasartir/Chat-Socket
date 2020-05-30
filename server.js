const express = require('express');
const path = require('path');

const app = express();

//protocolo wss -> websocket
const server = require('http').createServer(app); //define o protocólo http
const io = require('socket.io')(server); //define o protocolo wss

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
    res.render('index.html');
});

let messages = [];

io.on('connection', socket => {
    console.log(`Socket conectado ${socket.id}`);

    socket.emit('previousMessages', messages);

    socket.on('sendMessage', data => {
        messages.push(data);
        socket.broadcast.emit('receivedMessage', data); //vai enviar para todos os sockets conectados
    }); //capturamos o evento criado no frontend
}); //toda vez que um usuário se conectar

server.listen(3000);