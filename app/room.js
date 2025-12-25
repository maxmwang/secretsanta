const _ = require('lodash');

const Participant = require('./participant');
const { match } = require('./match');

const STANDBY = 'standby';
const MATCHED = 'matched';
const REVEALED = 'revealed';

class Room {
  constructor(code, ref, participants, onClose) {
    this.code = code;
    this.ref = ref;
    this.participantRef = ref.child("participants");

    this.participants = participants;
    this.onClose = onClose;
    this.phase = STANDBY;
    this.restrictions = {};
    this.n_santas = 1;
  }

  addParticipant(name, socket) {
    const isAdmin = this.participants.length === 0;
    this.participants.push(new Participant(name, this.participantRef.child(name), socket, isAdmin));
    this.notifyParticipantUpdate();
    this.participantRef.child(name).set({ name });
    if (isAdmin) {
      this.ref.child('admin').set(name);
    }
  }

  removeParticipant(name) {
    var removedParticipant = _.remove(this.participants, p => p.name == name);
    this.participantRef.child(name).remove();
    if (this.participants.length === 0) {
      this.close();
    } else {
      this.notifyParticipantUpdate();
    }
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

  getNumParticipants() {
    return this.participants.length;
  }

  activate(name, socket) {
    this.get(name).active = true;
    this.get(name).socket = socket;
    this.notifyParticipantUpdate();
  }

  deactivate(name) {
    this.get(name).active = false;
    this.get(name).socket = undefined;
    this.notifyParticipantUpdate();
  }

  getParticipantData() {
    return { participants: this.participants.map(p => p.json()) };
  }

  addRestriction(participant, target) {
    if (!(participant.name in this.restrictions)) {
      this.restrictions[participant.name] = [];
    }
    if (!this.restrictions[participant.name].includes(target)) {
      this.restrictions[participant.name].push(target);
      this.notifyOptions();
    }
  }

  removeRestriction(name, target) {
    if (name in this.restrictions && this.restrictions[name].includes(target)) {
      const index = this.restrictions[name].indexOf(target);
      this.restrictions[name].splice(index, 1);
      this.notifyOptions();
    }
  }

  setSantas(n_santas) {
    this.n_santas = n_santas;
    this.notifyOptions();
  }

  match() {
    let santas;
    try {
      santas = match(this.participants.map(p => p.name), this.n_santas, this.restrictions);
    } catch (e) {
      this.participants.forEach(p => p.send('message', { message: e.message }));
      return false;
    }

    this.participants.forEach(p => {
      p.send('santas', {'santas': santas[p.name]});
      p.ref.child("targets").set(santas[p.name]);
    });
    this.ref.child('n_santas').set(this.n_santas);
    return true;
  }

  adminMatch(participant) {
    if (!participant.isAdmin) {
      return;
    }
    if (this.phase !== STANDBY || this.getNumParticipants() < 3) {
      participant.send('message', { message: 'Need at least 3 participants!' });
      return
    }
    if (!this.match()) {
      return;
    }
    this.phase = MATCHED;
    this.ref.child('phase').set(this.phase);
    this.notifyPhaseChange();
  }

  adminReveal(participant) {
    if (!participant.isAdmin) {
      return;
    }
    if (this.phase !== MATCHED) {
      participant.send('message', { message: 'Room has not been matched yet!' });
      return
    }
    this.phase = REVEALED;
    this.ref.child('phase').set(this.phase);
    this.notifyPhaseChange();
    this.notifyRevealedSantas();
  }

  withRevealedSantas(fn) {
    this.participantRef.once('value', s => {
      let santaMap = {};
      const participants = s.val();
      for (let p of Object.keys(participants)) {
        santaMap[p] = participants[p]['targets'];
      }
      fn(santaMap);
    });
  }

  notifyRevealedSantas() {
    this.withRevealedSantas(s => {
      this.participants.forEach(p => p.send('revealedSantas', { santas: s }));
    });
  }

  notifyOptions() {
    this.participants.forEach(p => p.send('options', { options: {
      restrictions: this.restrictions,
      n_santas: this.n_santas,
    }}));
  }

  notifyParticipantUpdate() {
    this.participants.forEach(p => p.send('participants', this.getParticipantData()));
  }

  notifyPhaseChange() {
    this.participants.forEach(p => p.send('phase', { phase: this.phase }));
  }

  sendWishlist(participant, target) {
    const isSelf = participant.name === target;
    this.participantRef.child(target).child('wishlist').once('value', s => {
      let wishlist = s.val() === null ? {} : s.val();
      participant.sendWishlist(wishlist, isSelf, this.phase === REVEALED);
    });
  }

  markItem(participant, target, itemId) {
    this.participantRef.child(target).child("wishlist").child(itemId).once("value", s => {
      const item = s.val();
      if (!item.marked) {
        this.participantRef
          .child(target)
          .child("wishlist")
          .child(itemId)
          .child("marked")
          .set(participant.name);
      } else {
        participant.send("message", { message: "This item is already marked!" });
      }
      this.sendWishlist(participant, target);
    });
  }

  unmarkItem(participant, target, itemId) {
    this.participantRef.child(target).child("wishlist").child(itemId).once("value", s => {
      const item = s.val();
      if (item.marked === participant.name) {
        this.participantRef
          .child(target)
          .child("wishlist")
          .child(itemId)
          .child("marked")
          .remove();
      } else {
        participant.send("message", { message: "You didn't mark this item!" });
      }
      this.sendWishlist(participant, target);
    })
  }

  sendReconnectData(participant) {
    participant.emitTargets();
    participant.send('phase', { phase: this.phase });
    if (this.phase === REVEALED) {
      this.withRevealedSantas(data => participant.send('revealedSantas', { santas: data }));
    }
  }

  close() {
    this.participants.forEach(p => p.send('close', {}));
    this.onClose();
  }
}

module.exports = Room;
