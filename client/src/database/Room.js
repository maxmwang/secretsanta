/*
3 things:
create room
delete room
get room
*/

import firebase from './Init.js';

const ROOM = "rooms"

export async function createRoom(room) {
  await firebase.database().ref(ROOM).child(room.id).set(room.json());
}

export async function deleteRoom(roomId) {
  await firebase.database().ref(ROOM).child(roomId).remove();
}

export async function getRoom(roomId) {
  await firebase.database().ref(ROOM).child(roomId).on('value', snapshot => {
    console.log(snapshot.val());
  })
}
