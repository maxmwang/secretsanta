var _ = require('lodash');

var Participant = require('./participant');
var { match } = require('./match');

const N_SANTAS = 2;

class Room {
  constructor(code, onClose) {
    this.code = code;
    this.participants = [];
    this.onClose = onClose;
  }

  addParticipant(name, socket) {
    this.participants.push(new Participant(name, socket));
    this.notifyParticipantUpdate();
  }

  exists(name) {
    return _.filter(this.participants, p => p.name == name).length > 0;
  }

  isActive(name) {
    return this.get(name).active;
  }

  get(name) {
    return _.filter(this.participants, p => p.name == name)[0];
  }

  activate(name, socket) {
    this.get(name).active = true;
    this.get(name).socket = socket;
    this.notifyParticipantUpdate();
  }

  deactivate(name) {
    this.get(name).active = false;
    this.get(name).socket = undefined;
    if (this.allDeactivated()) {
      this.end();
    } else {
      this.notifyParticipantUpdate();
    }
  }

  allDeactivated() {
    for (var p of this.participants) {
      if (p.active) {
        return false;
      }
    }
    return true;
  }

  getParticipantData() {
    return { participants: this.participants.map(p => p.json()) };
  }

  match() {
    const santas = match(this.participants.map(p => p.name), N_SANTAS);
    console.log(santas);
    this.participants.forEach(p => {
      p.send('santas', {'santas': santas[p.name]});
    });
  }

  notifyParticipantUpdate() {
    this.participants.forEach(p => p.send('participants', this.getParticipantData()));
  }

  end() {
    this.participants.forEach(p => p.send('end', {}));
    this.onClose();
  }
}

module.exports = Room;