import React, { Component } from 'react';

import './index.css';

class Item extends Component {
  render() {
    return (
      <div
        className="wishlist-item-placeholder border-blue-400"
        onClick={() => this.props.onClick()}
      >
        <p className="text-blue-400 font-semibold">
          + Add Item
        </p>
      </div>
    );
  }
}

export default Item;
