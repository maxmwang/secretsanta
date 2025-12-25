const c = require('./const');
const { linkPreview } = require("./link_preview");

class Participant {
  constructor(name, ref, socket, isAdmin) {
    this.name = name;
    this.ref = ref;
    this.socket = socket;
    this.active = true;
    this.isAdmin = isAdmin;
  }

  json() {
    return {
      name: this.name,
      active: this.active,
      isAdmin: this.isAdmin,
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

  addGuess(revealedSantas, guessName, maxGuesses) {
    this.ref.child('guesses').once('value', s => {
      let guesses = s.val() === null ? {} : s.val();

      if (Object.keys(guesses).length == maxGuesses) {
        this.send('message', { message: 'You have reached the maximum number of guesses' })
        return;
      }

      const isCorrect = revealedSantas[guessName].includes(this.name);
      guesses[guessName] = isCorrect;
      this.ref.child('guesses').set(guesses);

      this.send('guesses', { guesses });
    });
  }

  sendGuesses() {
    this.ref.child('guesses').once('value', s => {
      const guesses = s.val() === null ? {} : s.val();
      this.send('guesses', { guesses });
    });
  }
}

module.exports = Participant;
