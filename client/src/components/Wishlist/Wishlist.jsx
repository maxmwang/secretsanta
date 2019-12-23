import React, { Component } from 'react';
import Modal from '@material-ui/core/Modal';

import Item from 'models/item';

const style = {
  boxShadow: '0px 0px 5px 0px #21252999',
};

class Wishlist extends Component {
  constructor(props) {
    super(props);

    this.state = {
      view: 'list',
      items: [],
      input: {
        name: '',
        price: '',
        link: '',
        style: '',
        notes: '',
      }
    };
  }

  componentDidMount() {
    // this.props.socket.emit('addItem', {item: new Item('test', 0, 'https://google.com', 'test', null)})
    this.props.socket.emit('getWishlist', {});

    this.props.socket.on('wishlist', data => {
      this.setState({items: Object.values(data.wishlist)});
    });
  }

  clearInput() {
    this.setState({ input: {
      name: '',
      price: '',
      link: '',
      style: '',
      notes: '',
    }});
  }

  modifyInput(type, value) {
    const inputCopy = this.state.input;
    inputCopy[type] = value;
    this.setState({ input: inputCopy });
  }

  addItemToWishlist() {
    console.log(this.state.input);
    const newItem = new Item(this.state.input.name,
      this.state.input.price,
      this.state.input.link,
      this.state.input.style,
      this.state.input.notes);

    this.props.socket.emit('addItem', {item: newItem});
    this.setState({ view: 'list' });

    this.props.socket.emit('getWishlist', {});

    this.props.socket.on('wishlist', data => {
      this.setState({items: Object.values(data.wishlist)});
    });
  }

  removeItemFromWishlist(itemId) {

  }

  render() {
    const items = [
      <tr>
        <th>Name</th>
        <th>Price</th>
        <th>Style</th>
        <th>Notes</th>
      </tr>,
    ]

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
      )
    })

    return (
      <div>
        {this.props.name}

        <table style={{ width: '100%', border: '5px'}}>
          <tbody>
            {items}
          </tbody>
        </table>

        <button type="button" className="btn btn-light" onClick={ () => this.setState({ view: 'popup' }) }>
          Add Item
        </button>

        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.view == 'popup'}
          close={() => this.clearInput()}
        >
          <div>
            <h2 id="simple-modal-title">Add Item</h2>

            <p id="simple-modal-description">
              <input type="name"
                      className="form-control"
                      placeholder="Enter the item's name"
                      value={this.state.input.name}
                      onChange={ e => this.modifyInput('name', e.target.value) }
              />
              <input type="price"
                      className="form-control"
                      placeholder="Enter the item's price"
                      value={this.state.input.price}
                      onChange={ e => this.modifyInput('price', e.target.value) }
              />
              <input type="link"
                      className="form-control"
                      placeholder="Enter the item's link"
                      value={this.state.input.link}
                      onChange={ e => this.modifyInput('link', e.target.value) }
              />
              <input type="style"
                      className="form-control"
                      placeholder="Style (optional)"
                      value={this.state.input.style}
                      onChange={ e => this.modifyInput('style', e.target.value) }
              />
              <input type="notes"
                      className="form-control"
                      placeholder="Notes (optional)"
                      value={this.state.input.notes}
                      onChange={ e => this.modifyInput('notes', e.target.value) }
              />
            </p>

            <button type="button" className="btn btn-light" onClick={ () => this.addItemToWishlist() }>
              Add Item
            </button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Wishlist;
