var Room = require('./room');

class Santa {
  constructor() {
    this.rooms = {};
  }

  createRoom() {
    const code = this.generateCode();
    const newRoom = new Room(code, () => this.close(code));
    this.rooms[code] = newRoom;
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