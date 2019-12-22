import React, { Component } from 'react';

const style = {
  boxShadow: '0px 0px 5px 0px #21252999',
};

class Wishlist extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: []
    };

    this.props.wishlist.push('pog');
  }

  render() {
    return (
      <div>
        {this.props.name}
        {this.props.wishlist}
      </div>
    );
  }
}

export default Wishlist;
