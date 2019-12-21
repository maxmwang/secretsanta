import Item from './item';

export default class Participant {
  constructor(name, targets, wishlist) {
    this.name = name;
    this.targets = targets;
    this.wishlist = wishlist;
  }

  json() {
    let jsonObject = {
      targets: [],
      wishlist: [],
    };

    this.targets.forEach(t => {
      jsonObject.targets.push(t);
    });

    this.wishlist.forEach(i => {
      jsonObject.wishlist.push(i);
    });

    return jsonObject;
  }

  static fromJson(name, jsonObject) {
    let targets = [];
    let wishlist = [];

    jsonObject.targets.forEach(t => {
      targets.push(t);
    });

    jsonObject.wishlist.forEach(i => {
      wishlist.push(new Item(i.name, i.link, i.style, i.notes));
    });

    return new Participant(name, targets, wishlist);
  }
}
