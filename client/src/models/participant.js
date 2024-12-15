export default class Participant {
  constructor(name, active, santa, self, isAdmin) {
    this.name = name;
    this.active = active;
    this.santa = santa;
    this.self = self;
    this.isAdmin = isAdmin;
  }
}