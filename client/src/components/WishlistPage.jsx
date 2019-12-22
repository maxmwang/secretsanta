import React, { Component } from 'react';

import Wishlist from './Wishlist';

import { getParticipant } from 'database/Participant';

const style = {
  boxShadow: '0px 0px 5px 0px #21252999',
};

class WishlistPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      myList: [],
      targetLists: []
    };

    getParticipant(this.props.roomId, this.props.name).then((p) => this.state.myList = p.wishlist)
    this.props.targetNames.forEach((n) => {
      getParticipant(this.props.roomId, n).then((p) => this.state.targetLists.push(p.wishlist));
    });

    console.log(this.state.targetLists)
  }

  addItemToWishlist() {}

  removeItemFromWishlist() {}

  render() {
    return (
      <div>
        <Wishlist
          name={ this.props.name }
          wishlist={ this.state.myList }
          addItem={ this.addItemToWishlist }
          removeItem={ this.removeItemFromWishlist }
        />
        <Wishlist name={ this.props.targetNames[0] } wishlist={ this.state.targetLists[0] } />
        <Wishlist name={ this.props.targetNames[1] } wishlist={ this.state.targetLists[1] } />
      </div>
    );
  }
}

export default WishlistPage;
