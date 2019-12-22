var Room = require('./room');

class Santa {
  constructor(db) {
    this.rooms = {};
    this.codesTaken = {};
    this.db = db;
    this.roomsRef = db.ref("rooms");

    this.roomsRef.once("value", s => {
        Object.keys(s.val()).forEach(code => this.codesTaken[code] = true);
    });
  }

  createRoom() {
    const code = this.generateCode();
    var roomRef = this.db.ref("rooms").child(code);

    const newRoom = new Room(code, roomRef, () => this.close(code));
    this.rooms[code] = newRoom;
    this.codeTaken[code] = true;
    return newRoom;
  }

  getRoom(code) {
    return this.rooms[code];
  }

  close(code) {
    delete this.rooms[code];
  }

  generateCode() {
    var code = '';
    const length = 4;
    do {
      for (var i = 0; i < length; i++) {
        code += String.fromCharCode(97 + Math.random() * 26);
      }
    } while (this.rooms[code]);
    return code;
  }
}

module.exports = Santa;