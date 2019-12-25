import React, { Component } from 'react';

import Modal from '@material-ui/core/Modal';

import Item from 'models/item';

class Wishlist extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false,
      errorMsg: '',
      items: [],
      input: {
        name: '',
        price: '',
        link: '',
        style: '',
        notes: '',
      },
    };
  }

  componentDidMount() {
    this.updateWishlist();
  }

  clearInput() {
    this.setState({
      modalOpen: false,
      errorMsg: '',
      input: {
        name: '',
        price: '',
        link: '',
        style: '',
        notes: '',
      },
    });
  }

  modifyInput(type, value) {
    const inputCopy = this.state.input;
    inputCopy[type] = value;
    this.setState({ input: inputCopy });
  }

  addItemToWishlist() {
    let missingInput;
    if (!this.state.input.name) {
      missingInput = 'Name';
    } else if (!this.state.input.price) {
      missingInput = 'Price';
    } else if (!this.state.input.link) {
      missingInput = 'Link';
    }
    if (missingInput) {
      this.setState({ errorMsg: `${missingInput} is required.` });
      return;
    }

    const newItem = new Item(
      this.state.input.name,
      this.state.input.price,
      this.state.input.link,
      this.state.input.style,
      this.state.input.notes
    );
    this.props.socket.emit('addItem', { item: newItem });

    this.updateWishlist();
    this.clearInput();
  }

  removeItemFromWishlist(itemId) {}

  updateWishlist() {
    this.props.socket.emit('getWishlist', {});

    this.props.socket.on('wishlist', data => {
      this.setState({ items: Object.values(data.wishlist) });
    });
  }

  renderModal() {
    return (
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={this.state.modalOpen}
        close={() => this.clearInput()}
      >
        <div>
          <h2>Add Item</h2>

          <p>
            <input
              type="text"
              placeholder="Enter the item's name"
              value={this.state.input.name}
              onChange={e => this.modifyInput('name', e.target.value)}
              required
            />
            <br />

            <input
              type="text"
              placeholder="Enter the item's price"
              value={this.state.input.price}
              onChange={e => this.modifyInput('price', e.target.value)}
              required
            />
            <br />

            <input
              type="text"
              placeholder="Enter the item's link"
              value={this.state.input.link}
              onChange={e => this.modifyInput('link', e.target.value)}
              required
            />
            <br />

            <input
              type="text"
              placeholder="Style (optional)"
              value={this.state.input.style}
              onChange={e => this.modifyInput('style', e.target.value)}
            />
            <br />

            <input
              type="text"
              placeholder="Notes (optional)"
              value={this.state.input.notes}
              onChange={e => this.modifyInput('notes', e.target.value)}
            />
            <br />
          </p>

          <button
            type="button"
            className="btn btn-light"
            onClick={() => this.addItemToWishlist()}
          >
            Add Item
          </button>

          {this.state.errorMsg && <div>{this.state.errorMsg}</div>}
        </div>
      </Modal>
    );
  }

  render() {
    const items = [
      <tr>
        <th>Name</th>
        <th>Price</th>
        <th>Style</th>
        <th>Notes</th>
      </tr>,
    ];

    this.state.items.forEach(item => {
      const styleTemp = item.style ? item.style : 'N/A';
      const notesTemp = item.notes ? item.notes : 'N/A';

      items.push(
        <tr>
          <td>
            <a href={item.link}>{item.name}</a>
          </td>
          <td>{item.price}</td>
          <td>{styleTemp}</td>
          <td>{notesTemp}</td>
        </tr>
      );
    });

    return (
      <div>
        {this.props.name}

        <table style={{ width: '100%', border: '5px' }}>
          <tbody>{items}</tbody>
        </table>

        <button
          type="button"
          className="btn btn-light"
          onClick={() => this.setState({ modalOpen: true })}
        >
          Add Item
        </button>

        {this.renderModal()}
      </div>
    );
  }
}

export default Wishlist;
