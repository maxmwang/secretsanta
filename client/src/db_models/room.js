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
}
