var Room = require('./room');
var Participant = require('./participant');

class Santa {
  constructor(db) {
    this.rooms = {};
    this.db = db;
    this.roomsRef = db.ref("rooms");

    this.loadRooms();
  }

  loadRooms() {
    this.roomsRef.once("value", s => {
        const rooms = s.val();
        if (rooms != undefined) {
            Object.keys(rooms).forEach(code => {
                const roomRef = this.roomsRef.child(code);

                const jsonParticipants = Object.keys(rooms[code]["participants"]);
                const participants = jsonParticipants.map( p => new Participant(p, roomRef.child("participants").child(p), undefined));
                participants.forEach((p) => p.active = false);

                let newRoom = new Room(code, roomRef, participants, () => this.close(code));
                newRoom.private = rooms[code].private;

                this.rooms[code] = newRoom;
            });
        }
    });
  }

  createRoom() {
    const code = this.generateCode();
    var roomRef = this.roomsRef.child(code);

    const newRoom = new Room(code, roomRef, [], () => this.close(code));
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
