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
}
