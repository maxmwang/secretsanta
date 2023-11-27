const _ = require('lodash');

const Participant = require('./participant');
const { match } = require('./match');

const N_SANTAS = 2;
const STANDBY = 'standby';
const MATCHED = 'matched';

class Room {
  constructor(code, ref, participants, onClose) {
    this.code = code;
    this.ref = ref;
    this.participantRef = ref.child("participants");

    this.participants = participants;
    this.onClose = onClose;
    this.phase = STANDBY;
    this.restrictions = {};
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

  addRestriction(participant, target) {
    if (!(participant.name in this.restrictions)) {
      this.restrictions[participant.name] = [];
    }
    if (!this.restrictions[participant.name].includes(target)) {
      this.restrictions[participant.name].push(target);
      this.notifyRestrictionsUpdate();
    }
  }

  removeRestriction(name, target) {
    if (name in this.restrictions && this.restrictions[name].includes(target)) {
      const index = this.restrictions[name].indexOf(target);
      this.restrictions[name].splice(index, 1);
      this.notifyRestrictionsUpdate();
    }
  }

  vote(participant, voteName, onVoteEnd, dupVoteMessage) {
    this.ref.child(voteName).once("value", s => {
      let votes = s.val();
      votes = votes === null ? [] : Object.values(votes);

      if (!votes.includes(participant.name)) {
        if (votes.length === this.participants.length - 1) {
          onVoteEnd();
        } else {
          this.ref.child(voteName).push(participant.name);
        }
      } else if (dupVoteMessage !== undefined) {
        participant.send('message', { message: dupVoteMessage });
      }
    });
  }

  match() {
    let santas;
    try {
      santas = match(this.participants.map(p => p.name), N_SANTAS, this.restrictions);
    } catch (e) {
      this.participants.forEach(p => p.send('message', { message: e.message }));
      return false;
    }

    this.participants.forEach(p => {
      p.send('santas', {'santas': santas[p.name]});
      p.ref.child("targets").set(santas[p.name]);
    });
    return true;
  }

  voteMatch(participant) {
    this.vote(participant, "matchVotes", 
      () => {
        if (!this.match()) {
          return;
        }
        this.phase = MATCHED;
        this.ref.child('phase').set(this.phase);
        this.notifyPhaseChange();
      }, "You have already voted to match this room");
  }

  voteClose(participant) {
    this.vote(participant, "closeVotes", () => this.close(), "You have already voted to close this room");
  }

  notifyRestrictionsUpdate() {
    this.participants.forEach(p => p.send('restrictions', { restrictions: this.restrictions }));
  }

  notifyParticipantUpdate() {
    this.participants.forEach(p => p.send('participants', this.getParticipantData()));
  }

  notifyPhaseChange() {
    this.participants.forEach(p => p.send('phase', { phase: this.phase }));
  }

  sendWishlist(participant, target) {
    this.participantRef.child(participant.name).child("targets").once("value", s => {
      const targets = s.val();
      const isTarget = targets.includes(target);
      const isSelf = participant.name === target;
      this.participantRef.child(target).child('wishlist').once('value', s => {
        let wishlist = s.val() === null ? {} : s.val();
        participant.sendWishlist(wishlist, isTarget, isSelf);
      });
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

  close() {
    this.participants.forEach(p => p.send('close', {}));
    this.onClose();
  }
}

module.exports = Room;
