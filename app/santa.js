var sha256 = require('js-sha256');

var Room = require('./room');
var Participant = require('./participant');

class Santa {
  constructor(db) {
    this.rooms = {};
    this.db = db;
    this.roomsRef = db.ref("rooms");
    this.passwordsRef = db.ref("passwords")

    this.loadRooms();
  }

  loadRooms() {
    this.roomsRef.once("value", s => {
      const rooms = s.val();
      if (rooms != undefined) {
        Object.keys(rooms).forEach(code => {
          const roomRef = this.roomsRef.child(code);
          const jsonParticipants = Object.keys(rooms[code]["participants"]);
          const participants = jsonParticipants.map(p => new Participant(p, roomRef.child("participants").child(p), undefined, rooms[code].admin === p));
          participants.forEach(p => p.active = false);

          let newRoom = new Room(code, roomRef, participants, () => this.close(code));
          newRoom.phase = rooms[code].phase;

          this.rooms[code] = newRoom;
        });
      }
    });
  }

  validateUserProvidedCode(code) {
    if (code in this.rooms) {
      return 'Room code is taken';
    }
    if (code.length < 4) {
      return 'Room code must be at least 4 characters';
    }
    if (!/^[a-zA-Z0-9]+$/.test(code)) {
      return 'Room code can only contain letters and numbers';
    }
    return undefined;
  }

  createRoom(roomCode) {
    var roomRef = this.roomsRef.child(roomCode);
    roomRef.child('phase').set('standby');

    const newRoom = new Room(roomCode, roomRef, [], () => this.close(roomCode));
    this.rooms[roomCode] = newRoom;
    return newRoom;
  }

  getRoom(code) {
    return this.rooms[code];
  }

  setPassword(roomCode, name, password) {
    const hash = sha256(password);
    this.passwordsRef.child(roomCode).child(name).set(hash);
  }

  async verifyPassword(roomCode, name, password) {
    let hash;
    await this.passwordsRef.child(roomCode).child(name).once('value', snapshot => {
      hash = snapshot.val();
    });
    return sha256(password) === hash;
  }

  removePasswords(roomCode) {
    this.passwordsRef.child(roomCode).remove();
  }

  close(code) {
    this.removePasswords(code);
    this.roomsRef.child(code).remove();
    delete this.rooms[code];
  }

  generateCode() {
    var code = '';
    const length = 4;
    do {
      for (var i = 0; i < length; i++) {
        code += String.fromCharCode(97 + Math.random() * 26);
      }
    } while (!this.codeIsAvailable(code));
    return code;
  }
}

module.exports = Santa;
