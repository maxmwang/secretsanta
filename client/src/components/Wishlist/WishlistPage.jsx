import React, { Component } from 'react';

import Wishlist from './Wishlist';
import Item from 'models/item';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

class WishlistPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      currentName: this.props.name,
      items: [],
    };

    this.count = this.props.targetNames.length + 1;
  }

  componentDidMount() {
    this.props.socket.emit('getWishlist', { target: this.state.currentName });

    this.props.socket.on('wishlist', data => {
      let items = [];
      const { wishlist } = data;

      Object.keys(wishlist).forEach(i => {
        items.push(new Item(
          i,
          wishlist[i].name,
          wishlist[i].price,
          wishlist[i].link,
          wishlist[i].style,
          wishlist[i].notes
        ));
      });

      this.setState({ items });
    });
  }

  move(direction) {
    // if index = 0, wishlist is self, otherwise, its target
    const index = (this.state.index + direction) % this.count
    const currentName = index === 0 ? this.props.name : this.props.targetNames[index - 1];
    this.setState({
      index,
      currentName,
      items: [],
    });

    this.props.socket.emit('getWishlist', { target: currentName });
  }

  render() {

    return (
      <div>
        <div className="row">
          <div className="col-3">
            <ChevronLeftIcon onClick={() => this.move(-1)} />
          </div>
          <div className="col-6">
            <p>{this.state.currentName}'s Wishlist</p>
          </div>
          <div className="col-3">
            <ChevronRightIcon onClick={() => this.move(1)} />
          </div>
        </div>
        <br />

        <Wishlist
          socket={this.props.socket}
          personal={this.state.index === 0}
          items={this.state.items} />

        <br />
        <button
          type="button"
          className="btn btn-light"
          onClick={ () => this.props.returnHome() }>
          Return
        </button>
      </div>
    );
  }
}

export default WishlistPage;
