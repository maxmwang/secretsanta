const express = require('express');
const path = require('path');
var bodyParser = require('body-parser');

var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);

const Santa = require('./app/santa');

const port = process.env.SECRET_SANTA_PORT || process.env.PORT || 5000;

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

  if (room !== undefined && room.exists(name)) {
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
    if (room.phase === 'standby') { // new
      res.send({ valid: true });
      app.santa.addPassword(roomCode, name, password);
    } else { // private
      res.send({ valid: false, message: 'You can no longer join this room' });
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

    participant.emitTargets();
    socket.emit('phase', { phase: room.phase });
  });

  socket.on('addRestriction', data => {
    if (room.phase === 'standby') {
      const { target } = data;
      room.addRestriction(participant, target);
    }
  });

  socket.on('removeRestriction', data => {
    if (room.phase === 'standby') {
      const { name, target } = data;
      room.removeRestriction(name, target);
    }
  });

  socket.on('setSantas', data => {
    if (room.phase === 'standby') {
      const { n_santas } = data;
      room.setSantas(n_santas);
    }
  });

  socket.on('voteMatch', data => {
    if (room.getNumParticipants() < 3) {
      socket.emit('message', {message: 'Need at least 3 participants!'});
    } else {
      room.voteMatch(participant);
    }
  });

  socket.on('getWishlist', data => {
    const { target } = data;
    room.sendWishlist(participant, target);
  });

  socket.on('addItem', data => {
    participant.addItem(data.item);
    participant.emitWishlist();
  });

  socket.on('removeItem', data => {
    participant.removeItem(data.id);
    participant.emitWishlist();
  });

  socket.on('editItem', data => {
    participant.editItem(data.item);
    participant.emitWishlist();
  });

  socket.on('importItem', data => {
    const { roomCode, participant: otherParticipant } = data;
    if (roomCode === undefined) {
      socket.emit('message', {message: 'Missing room code'});
      return
    }
    const otherRoom = app.santa.getRoom(roomCode);
    if (otherRoom === undefined) {
      socket.emit('message', {message: 'This room code does not exist'});
      return;
    }
    if (otherRoom.code === room.code) {
      socket.emit('message', {message: 'Other room cannot be the same as current room'});
      return;
    }
    if (otherParticipant === undefined) {
      socket.emit('importParticipants', {participants: otherRoom.participants.map(p => p.name)});
      return;
    }
    const other = otherRoom.get(otherParticipant);
    other.withWishlist(async wishlist => {
      for (let item of Object.values(wishlist)) {
        await participant.addItem(item);
      }
      participant.emitWishlist();
    });
  });

  socket.on('markItem', data => {
    room.markItem(participant, data.target, data.itemId);
  });

  socket.on('unmarkItem', data => {
    room.unmarkItem(participant, data.target, data.itemId);
  });

  socket.on('disconnect', data => {
    if (room !== undefined && room.exists(name)) {
      if (room.phase !== 'standby') {
        room.deactivate(name);
      } else {
        room.removeParticipant(name);
      }
    }
  });
});


if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, 'client/dist')));
    // Handle React routing, return all requests to React app
    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
    });
}

server.listen(port, () => console.log(`Listening on port ${port}`));
