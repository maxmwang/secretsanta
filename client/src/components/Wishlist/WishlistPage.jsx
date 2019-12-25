import React, { Component } from 'react';

import Wishlist from './Wishlist';

class WishlistPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      view: 'my',
    };
  }

  render() {
    const views = {
      my: (
        <Wishlist
          socket={this.props.socket}
          personal={true}
          name={this.props.name} />
      ),
      target1: (
        <Wishlist
          socket={this.props.socket}
          personal={false}
          name={this.props.targetNames[0]} />
      ),
      target2: (
        <Wishlist
          socket={this.props.socket}
          personal={false}
          name={this.props.targetNames[1]} />
      ),
    };

    return <div>{views[this.state.view]}</div>;
  }
}

export default WishlistPage;
