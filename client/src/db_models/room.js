import Participant from "./participant";

export default class Room {
  constructor(id, participants) {
    this.id = id;
    this.participants = participants;
  }

  json() {
    let jsonObject = {};
    this.participants.forEach(p => {
      jsonObject[p.name] = p.json();
    });

    return jsonObject;
  }

  static fromJson(id, jsonObject) {
    let participants = []
    Object.keys(jsonObject).forEach(p => {
      participants.push(Participant.fromJson(p, jsonObject[p]));
    });

    return new Room(id, participants);
  }
}
