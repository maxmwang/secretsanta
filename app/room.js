var _ = require('lodash');

var Participant = require('./participant');
var { match } = require('./match');

const N_SANTAS = 2;

class Room {
  constructor(code, ref, participants, onClose) {
    this.code = code;
    this.ref = ref;
    this.participantRef = ref.child("participants");

    this.participants = participants;
    this.onClose = onClose;
    this.private = false;
  }

  addParticipant(name, socket) {
    this.participants.push(new Participant(name, this.participantRef.child(name), socket));
    this.notifyParticipantUpdate();
    this.participantRef.child(name).set({'name': name});
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

  match() {
    const santas = match(this.participants.map(p => p.name), N_SANTAS);
    this.participants.forEach(p => {
      p.send('santas', {'santas': santas[p.name]});
      p.ref.child("targets").set(santas[p.name]);
    });
  }

  setPrivate() {
    this.private = true;
    this.participants.forEach(p => {
      p.send('privated', {});
    });
    this.ref.child('private').set(true);
  }

  voteClose(participant) {
    this.ref.child("closeVotes").once("value", s => {
      let votes = s.val();
      votes = votes === null ? [] : Object.values(votes);

      let totalVotes = votes.length;
      let newVote = !votes.includes(participant.name);

      if (newVote) {
        this.ref.child("closeVotes").push(participant.name);
        totalVotes += 1;
      } else {
        participant.send('message', { message: "You have already voted" });
      }

      if (totalVotes === this.participants.length) {
        this.close();
      }
    });
  }

  notifyParticipantUpdate() {
    this.participants.forEach(p => p.send('participants', this.getParticipantData()));
  }

  sendWishlist(participant, target) {
    this.participantRef.child(participant.name).child("targets").once("value", s => {
      const targets = s.val();
      if (targets.includes(target)) {
        this.participantRef.child(target).child('wishlist').once('value', s => {
          let wishlist = s.val() === null ? {} : s.val();
          this.send('wishlist', { wishlist });
        });
      }
    });
  }

  close() {
    this.participants.forEach(p => p.send('close', {}));
    this.onClose();
  }
}

module.exports = Room;
