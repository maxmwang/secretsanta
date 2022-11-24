const ITEM_MARK_STATE = {
  HIDDEN: 0,
  UNMARKED: 1,
  MARKED: 2,
  CAN_UNMARK: 3,
}

export default class Item {
  constructor(id, name, price, link, style, notes, mark_state) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.link = link;
    this.style = style;
    this.notes = notes;
    this.mark_state = mark_state;
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
}
