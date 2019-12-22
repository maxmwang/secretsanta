import firebase from './Init.js';

import { getRoom, updateRoom } from './Room';

import Participant from 'db_models/participant';

const ROOM = "rooms";

export async function addParticipantToRoom(roomId, participant) {
  getRoom(roomId).then(room => {
    room.participants.push(participant);
    updateRoom(room);
  });
}

export async function updateParticipant(roomId, participant) {
  await firebase.database().ref(ROOM).child(roomId).set(participant.json());
}

export async function getParticipant(roomId, name) {
  let participant;
  await firebase.database().ref(ROOM).child(roomId).child(name).once('value', (snapshot) => {
    participant = Participant.fromJson(name, snapshot.val());
  });

  return participant;
}
