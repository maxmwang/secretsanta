import firebase from './Init.js';

const PASSWORDS = "passwords";
var sha256 = require('js-sha256');

export async function addPassword(roomId, user, password) {
  const hash = sha256(password);

  await firebase.database()
    .ref(PASSWORDS)
    .child(roomId)
    .child(user).set(hash);
}

export async function checkPassword(roomId, user, password, onSuccess, onFailure) {
  await firebase.database().ref(PASSWORDS).child(roomId).child(user).on('value', snapshot => {
    const hash = sha256(password);
    if (hash == snapshot.val()) {
      onSuccess();
    } else {
      onFailure();
    }
  });
}

export async function deletePasswords(roomId) {
  await firebase.database().ref(PASSWORDS).child(roomId).remove();
}
