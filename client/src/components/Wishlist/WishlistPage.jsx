import React, { Component } from 'react';

import Wishlist from './Wishlist';
import Item from 'models/item';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import RefreshIcon from '@material-ui/icons/Refresh';

class WishlistPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: this.props.names.indexOf(this.props.name),
      currentName: this.props.name,
      items: [],
      target: false,
      self: true,
    };
  }

  componentDidMount() {
    this.props.socket.emit('getWishlist', { target: this.state.currentName });

    this.props.socket.on('wishlist', data => {
      let items = [];
      const { wishlist, target, self } = data;

      Object.keys(wishlist).forEach(i => {
        items.push(new Item(
          i,
          wishlist[i].name,
          wishlist[i].price,
          wishlist[i].link,
          wishlist[i].style,
          wishlist[i].notes,
          wishlist[i].marked,
        ));
      });

      this.setState({
        items,
        target,
        self,
      });
    });
  }

  refreshWishlist() {
    this.props.socket.emit('getWishlist', { target: this.state.currentName });
  }

  move(direction) {
    // if index = 0, wishlist is self, otherwise, its target
    const index = ((this.state.index + direction + this.props.names.length) % this.props.names.length);
    const currentName = this.props.names[index];
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
            <ChevronLeftIcon
              style={{cursor: 'pointer'}}
              onClick={ () => this.move(-1) } />
          </div>
          <div className="col-6">
            <p>
              {this.state.currentName}'s Wishlist
              <RefreshIcon fontSize="small" style={{cursor: 'pointer'}} onClick={ () => this.refreshWishlist() }/>
            </p>
          </div>
          <div className="col-3">
            <ChevronRightIcon
              style={{cursor: 'pointer'}}
              onClick={() => this.move(1)} />
          </div>
        </div>
        <br />

        <Wishlist
          name={this.props.name}
          target={this.state.currentName}
          socket={this.props.socket}
          canEdit={this.state.self}
          canMark={this.state.target}
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
