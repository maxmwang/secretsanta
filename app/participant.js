class Participant {
  constructor(name, ref, socket) {
    this.name = name;
    this.ref = ref;
    this.socket = socket;
    this.active = true;
  }

  json() {
    return {
      name: this.name,
      active: this.active,
    };
  }

  send(event, data) {
    if (this.socket != undefined) {
      this.socket.emit(event, data);
    }
  }

  emitTargets() {
    this.ref.child('targets').once('value', s => {
      if (s.val() != null) {
        this.send('santas', {'santas': s.val()});
      }
    });
  }

  emitWishlist() {
    this.ref.child('targets').once('value', s => {
      if (s.val() != null) {
        this.send('wishlist', {'santas': s.val()});
      }
    });
    // emit wishlists
    // used at server.js 108:
  }
}

module.exports = Participant;
