const express = require('express');
const path = require('path');
var bodyParser = require('body-parser');

var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);

const Santa = require('./app/santa');

const port = process.env.PORT || 5000;

var admin = require("firebase-admin");
var serviceAccount = require("./secretsanta-ea79a-firebase-adminsdk-bo1t6-8a3af719ff.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://secretsanta-ea79a.firebaseio.com"
});
var db = admin.database();
var ROOMS_REF = db.ref("rooms");

app.use(bodyParser.json());
app.io = io;
app.santa = new Santa();

app.post('/api/create', (req, res) => {
  const room = app.santa.createRoom();
  res.send({
    roomCode: `${room.code}`
  });
});

app.get('/dump', (req, res) => {
  console.log(app.santa);
  res.send();
});

app.get('/api/checkname', (req, res) => {
  const { name } = req.query;
  if (name.length < 2 || name.length > 12) {
    res.send({ valid: false, message: 'Your name must be between 2 and 12 characters long' });
    return;
  }

  const { roomCode } = req.query;
  if (roomCode != undefined) {
    const room = app.santa.getRoom(roomCode);
    if (room.exists(name) && !room.isActive(name)) {
      res.send({ valid: true });
      return;
    } else if (room.exists(name)) {
      res.send({ valid: false, message: 'This name has been taken' });
      return;
    }
  }

  res.send({ valid: true });
});

app.get('/api/checkcode', (req, res) => {
  const { roomCode } = req.query;
  const room = app.santa.getRoom(roomCode);
  if (room != undefined) {
    res.send({ valid: true });
  } else {
    res.send({ valid: false, message: 'This room code is invalid' });
  }
});

app.io.on('connect', function (socket) {
  var room;
  var name;
  var player;

  socket.on('join', data => {
    name = data.name;
    room = app.santa.getRoom(data.roomCode);

    if (room.exists(name)) {
      room.activate(name, socket);
    } else {
      room.addParticipant(name, socket);
      ROOMS_REF.child(data.roomCode).child(name).set({'name': name});
    }

    player = room.get(name);
  });

  socket.on('matchRoom', data => {
    if (room.getNumParticipants() < 3) {
      socket.emit('message', {message: 'Need at least 3 participants!'});
    } else {
      const santas = room.match();
      Object.keys(santas).forEach(name => {
        ROOMS_REF.child(room.code).child(name).child("targets").set(santas[name]);
      });
    }
  });

  socket.on('closeRoom', data => {
    room.close();
  });

  socket.on('disconnect', data => {
    if (room !== undefined && room.exists(name)) {
      room.deactivate(name);
    }
  });
});


if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, 'client/build')));
    // Handle React routing, return all requests to React app
    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}

server.listen(port, () => console.log(`Listening on port ${port}`));
