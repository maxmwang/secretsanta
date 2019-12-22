import firebase from './Init.js';

import { getRoom, updateRoom } from './Room';

import Participant from 'db_models/participant';

const ROOM = "rooms";
const TARGETS = "targets";

export async function addParticipantToRoom(roomId, participant) {
  getRoom(roomId).then(room => {
    room.participants.push(participant);
    updateRoom(room);
  });
}

export async function setTargets(roomId, name, targets) {
  await firebase.database().ref(ROOM).child(roomId).child(name).child(TARGETS).set(targets);
}

export async function getParticipant(roomId, name) {
  let participant;
  await firebase.database().ref(ROOM).child(roomId).child(name).once('value', (snapshot) => {
    participant = Participant.fromJson(name, snapshot.val());
  });

  return participant;
}
