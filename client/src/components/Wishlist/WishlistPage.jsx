import React, { Component } from 'react';

import Wishlist from './Wishlist';
import Item from 'models/item';
import Name from 'components/Name';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import RefreshIcon from '@material-ui/icons/Refresh';

class WishlistPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: this.props.participants.findIndex(p => p.name === this.props.name),
      items: [],
      target: false,
      self: true,
    };
  }

  componentDidMount() {
    this.refreshWishlist();

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
          wishlist[i].mark_state,
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
    this.props.socket.emit('getWishlist', { target: this.props.participants[this.state.index].name });
  }

  move(direction) {
    // if index = 0, wishlist is self, otherwise, its target
    const index = ((this.state.index + direction + this.props.participants.length) % this.props.participants.length);
    this.setState({
      index,
      items: [],
    }, () => this.refreshWishlist());
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
              Wishlist for <Name participant={this.props.participants[this.state.index]}/>
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
          target={this.props.participants[this.state.index].name}
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
