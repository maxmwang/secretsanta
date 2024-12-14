const c = require('./const');
const { linkPreview } = require("./link_preview");

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

  withWishlist(fn) {
    this.ref.child('wishlist').once('value', s => {
      let wishlist = s.val() === null ? {} : s.val();
      fn(wishlist);
    });
  }

  emitWishlist() {
    this.ref.child('wishlist').once('value', s => {
      let wishlist = s.val() === null ? {} : s.val();
      this.sendWishlist(wishlist, false, true);
    });
  }

  sendWishlist(wishlist, self, reveal) {
    Object.values(wishlist).forEach(i => {
      if (reveal) {
        i.mark_state = c.ITEM_MARK_STATE.REVEALED
      } else if (self) {
        i.mark_state = c.ITEM_MARK_STATE.HIDDEN;
      } else {
        if (i.marked === this.name) {
          i.mark_state = c.ITEM_MARK_STATE.CAN_UNMARK;
        } else if (i.marked) {
          i.mark_state = c.ITEM_MARK_STATE.MARKED;
        } else {
          i.mark_state = c.ITEM_MARK_STATE.UNMARKED;
        }
      }
      if (!reveal) {
        delete i.marked;
      }
    });

    this.send('wishlist', { wishlist });
  }

  async addItem(item) {
    // if (item.link !== undefined && item.link !== '') {
    //   const previewLink = await linkPreview(item.link);
    //   if (previewLink !== undefined) {
    //     item.preview_src = previewLink;
    //   }
    // }
    this.ref.child('wishlist').push(item);
  }

  removeItem(id) {
    this.ref.child('wishlist').child(id).remove();
  }

  editItem(item) {
    const itemRef = this.ref.child('wishlist').child(item.id);
    itemRef.once('value', s => {
      let dbItem = s.val() === null ? {} : s.val();
      dbItem = { ...dbItem, ...item, }
      itemRef.set(dbItem);
    });
  }
}

module.exports = Participant;
