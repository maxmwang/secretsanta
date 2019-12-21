/*
3 things:
create room
delete room
get room
*/

import firebase from './Init.js';

export async function createRoom(room) {
  await firebase.database().ref(room.id).set(room.json());
}

export async function deleteRoom(roomId) {
  await firebase.database().ref(roomId).remove();
}

export async function getRoom(roomId) {
  await firebase.database().ref(roomId).on('value', snapshot => {
    console.log(snapshot.val());
  })
}
