import Participant from "./participant";

export default class Room {
  constructor(id, participants) {
    this.id = id;
    this.participants = participants;
  }

  static fromJson(id, jsonObject) {
    let participants = []
    Object.keys(jsonObject).forEach(p => {
      participants.push(Participant.fromJson(p, jsonObject[p]));
    });

    return new Room(id, participants);
  }
}
