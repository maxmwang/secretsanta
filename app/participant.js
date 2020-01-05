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
    this.ref.child('wishlist').once('value', s => {
      let wishlist = s.val() === null ? {} : s.val();
      Object.values(wishlist).forEach(i => {
        delete i.marked
      });

      this.send('wishlist', { wishlist });
    });
  }

  addItem(item) {
    this.ref.child('wishlist').push(item);
  }

  removeItem(id) {
    this.ref.child('wishlist').child(id).remove();
  }

  editItem(item) {
    this.ref.child('wishlist').child(item.id).child("price").set(item.price);
    this.ref.child('wishlist').child(item.id).child("link").set(item.link);
    this.ref.child('wishlist').child(item.id).child("style").set(item.style);
    this.ref.child('wishlist').child(item.id).child("notes").set(item.notes);
  }
}

module.exports = Participant;
