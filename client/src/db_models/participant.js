import Item from './item';

export default class Participant {
  constructor(name, targets, wishlist) {
    this.name = name;
    this.targets = targets;
    this.wishlist = wishlist;
  }

  static fromJson(name, jsonObject) {
    let targets = [];
    let wishlist = [];

    if (jsonObject.targets != undefined) {
      jsonObject.targets.forEach(t => {
        targets.push(t);
      });
    }

    if (jsonObject.wishlist != undefined) {
      jsonObject.wishlist.forEach(i => {
        wishlist.push(new Item(i.name, i.price, i.link, i.style, i.notes));
      });
    }

    return new Participant(name, targets, wishlist);
  }
}
