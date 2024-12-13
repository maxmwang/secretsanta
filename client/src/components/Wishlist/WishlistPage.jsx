import React, { Component } from 'react';

import Wishlist from './Wishlist';
import Item from 'models/item';
import Name from 'components/Name';
import { BigButton } from 'components/Button';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import RefreshIcon from '@material-ui/icons/Refresh';
import CircularProgress from '@material-ui/core/CircularProgress';

class WishlistPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: this.props.participants.findIndex(p => p.name === this.props.name),
      items: [],
      target: false,
      self: true,
      loading: true,
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
          wishlist[i].preview_src,
        ));
      });

      this.setState({
        items,
        target,
        self,
        loading: false,
      });
    });
  }

  refreshWishlist() {
    this.setState({
      loading: true,
    });
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
        <h1 className="text-lg md:text-2xl font-semibold text-blue-400 inline-block mb-2">
          Wishlists
        </h1>
        <div className="row">
          <div className="col-2">
            <ChevronLeftIcon
              style={{cursor: 'pointer'}}
              onClick={ () => this.move(-1) } />
          </div>
          <div className="col-8">
            <p>
              <Name participant={this.props.participants[this.state.index]}/>
              <RefreshIcon fontSize="small" style={{cursor: 'pointer'}} onClick={ () => this.refreshWishlist() }/>
            </p>
          </div>
          <div className="col-2">
            <ChevronRightIcon
              style={{cursor: 'pointer'}}
              onClick={() => this.move(1)} />
          </div>
        </div>
        <br />

        {this.state.loading &&
          <CircularProgress/>
        }
        <Wishlist
          name={this.props.name}
          target={this.props.participants[this.state.index].name}
          socket={this.props.socket}
          canEdit={this.state.self}
          canMark={this.state.target}
          items={this.state.items} />

        <br />
        <BigButton
          type="button"
          className="btn btn-light"
          onClick={ () => this.props.returnHome() }>
          Return
        </BigButton>
      </div>
    );
  }
}

export default WishlistPage;
