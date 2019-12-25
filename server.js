const express = require('express');
const path = require('path');
var bodyParser = require('body-parser');

var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);

const Santa = require('./app/santa');

const port = process.env.PORT || 5000;

var admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.cert({
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.CLIENT_EMAIL,
  }),
  databaseURL: "https://secretsanta-ea79a.firebaseio.com"
});
var db = admin.database();

app.use(bodyParser.json());
app.io = io;
app.santa = new Santa(db);

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
  } else {
    res.send({ valid: true });
  }
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

app.post('/api/attemptjoin', (req, res) => {
  const { name, roomCode } = req.query;
  const { password } = req.body;
  const room = app.santa.getRoom(roomCode);

  if (room.exists(name)) {
    if (!room.isActive(name)) { // existing
      app.santa.verifyPassword(roomCode, name, password).then(verified => {
        if (verified) {
          res.send({ valid: true });
        } else {
          res.send({ valid: false, message: 'Incorrect password' });
        }
      });
    } else { // duplicate
      res.send({ valid: false, message: 'This name has been taken' });
    }
  } else {
    if (!room.private) { // new
      res.send({ valid: true });
      app.santa.addPassword(roomCode, name, password);
    } else { // private
      res.send({ valid: false, message: 'This room is private' });
    }
  }
});

app.io.on('connect', function (socket) {
  var room;
  var name;
  var participant;

  socket.on('join', data => {
    name = data.name;
    room = app.santa.getRoom(data.roomCode);

    if (room.exists(name)) {
      room.activate(name, socket);
    } else {
      room.addParticipant(name, socket);
    }

    participant = room.get(name);

    if (room.private) { participant.send('privated', {}); }
    participant.emitTargets();
  });

  socket.on('matchRoom', data => {
    if (room.getNumParticipants() < 3) {
      socket.emit('message', {message: 'Need at least 3 participants!'});
    } else {
      room.match();
    }
  });

  socket.on('confirmMatch', data => {
    room.setPrivate();
  });

  socket.on('addItem', data => {
    participant.addItem(data.item);
  });

  socket.on('removeItem', data => {
    participant.removeItem(data.id);
  })

  socket.on('voteClose', data => {
    room.voteClose(participant);
  });

  socket.on('disconnect', data => {
    if (room !== undefined && room.exists(name)) {
      if (room.private) {
        room.deactivate(name);
      } else {
        room.removeParticipant(name);
      }
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
