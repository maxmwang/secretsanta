/*
3 things:
create room
delete room
get room
*/

import firebase from './Init.js';
import Room from 'db_models/room';

const ROOM = "rooms"

export async function createRoom(room) {
  await firebase.database().ref(ROOM).child(room.id).set(room.json());
}

export async function deleteRoom(roomId) {
  await firebase.database().ref(ROOM).child(roomId).remove();
}

export async function getRoom(roomId) {
  let room;
  await firebase.database().ref(ROOM).child(roomId).once('value', (snapshot) => {
    room = Room.fromJson(roomId, snapshot.val());
  });

  return room;
}
