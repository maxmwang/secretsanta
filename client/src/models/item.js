const ITEM_MARK_STATE = {
  HIDDEN: 0, // you should not be able to see if items on your list ar emarked
  UNMARKED: 1, // item is unmarked on someone else's list
  MARKED: 2, // item is marked on someone else's list by someone else
  CAN_UNMARK: 3, // item is marked on someone else's list by you
  REVEALED: 4, // room is finished and we should reveal who marked the item
}

export default class Item {
  constructor(id, name, price, link, style, notes, mark_state, marked_by, preview_src) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.link = link;
    this.style = style;
    this.notes = notes;
    this.mark_state = mark_state;
    this.marked_by = marked_by;
    this.preview_src = preview_src;
  }

  markIsHidden() {
    return this.mark_state === ITEM_MARK_STATE.HIDDEN;
  }

  canUnmark() {
    return this.mark_state === ITEM_MARK_STATE.CAN_UNMARK;
  }

  isMarked() {
    return this.mark_state === ITEM_MARK_STATE.MARKED || this.mark_state === ITEM_MARK_STATE.CAN_UNMARK;
  }

  isRevealed() {
    return this.mark_state === ITEM_MARK_STATE.REVEALED;
  }
}
