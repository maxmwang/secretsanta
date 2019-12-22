import Participant from "./participant";

export default class Room {
  constructor(id, participants) {
    this.id = id;
    this.participants = participants;
  }

  json() {
    let jsonObject = {};
    this.participants.forEach(p => {
      jsonObject[p.name] = p;
    });

    return jsonObject;
  }

  static fromJson(id, jsonObject) {
    let participants = []
    jsonParticipants = jsonObject["participants"];
    Object.keys(jsonParticipants).forEach(p => {
      participants.push(Participant.fromJson(p, jsonParticipants[p]));
    });

    return new Room(id, participants);
  }
}
