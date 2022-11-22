import React, { Component } from 'react';

import Modal from '@material-ui/core/Modal';
import CloseIcon from '@material-ui/icons/Close';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import EditIcon from '@material-ui/icons/Edit';

import Item from 'models/item';

class Wishlist extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editItemId: null,
      modalOpen: null,
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

  clearInput() {
    this.setState({
      editItemId: null,
      modalOpen: null,
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
      '',
      this.state.input.name,
      this.state.input.price,
      this.state.input.link,
      this.state.input.style,
      this.state.input.notes,
      undefined
    );
    this.props.socket.emit('addItem', { item: newItem });

    this.clearInput();
  }

  removeItemFromWishlist(itemId) {
    this.props.socket.emit('removeItem', { id: itemId });
  }

  editItem() {
    this.props.socket.emit('editItem', { item: new Item(
      this.state.editItemId,
      this.state.input.name,
      this.state.input.price,
      this.state.input.link,
      this.state.input.style,
      this.state.input.notes,
      undefined
    )});

    this.clearInput();
  }

  renderItemAction(item) {
    if (this.props.canEdit) {
      return (
        <div>
          <td>
            <CloseIcon
              style={{ cursor: 'pointer' }}
              fontSize="small"
              onClick={() => this.removeItemFromWishlist(item.id)}
            />
          </td>
          <td>
            <EditIcon
              onClick={() => this.setState({
                editItemId: item.id,
                modalOpen: 'edit',
                input: {
                  name: item.name,
                  price: item.price,
                  link: item.link,
                  style: item.style,
                  notes: item.notes,
                }
              })}
            />
          </td>
        </div>
      );
    } else if (this.props.canMark) {
      return item.marked ? (
        <td>
          <CheckBoxIcon onClick={() => this.unmarkItem(item.id)} color={item.marked === this.props.self ? 'primary' : ''} />
        </td>
      ) : (
        <td>
          <CheckBoxOutlineBlankIcon onClick={() => this.markItem(item.id)} />
        </td>
      );
    }
  }

  markItem(id) {
    this.props.socket.emit('markItem', {
      target: this.props.name,
      itemId: id,
    });
  }

  unmarkItem(id) {
    this.props.socket.emit('unmarkItem', {
      target: this.props.name,
      itemId: id,
    });
  }

  renderTable() {
    const items = [
      <tr>
        <th>Name</th>
        <th>Price</th>
        <th>Style</th>
        <th>Notes</th>
        <th></th>
      </tr>,
    ];

    if (this.props.items) {
      for (let item of this.props.items) {
        const styleTemp = item.style ? item.style : 'N/A';
        const notesTemp = item.notes ? item.notes : 'N/A';
        let linkTemp;
        if (item.link.startsWith('http://') || item.link.startsWith('https://')) {
          linkTemp = item.link;
        } else {
          linkTemp = `//${item.link}`;
        }

        items.push(
          <tr>
            <td>
              <a href={linkTemp}
                target="_blank"
                rel="noopener noreferrer"
              >{item.name}</a>
            </td>
            <td>{item.price}</td>
            <td>{styleTemp}</td>
            <td>{notesTemp}</td>
            {this.renderItemAction(item)}
          </tr>
        );
      }

      return (
        <table style={{ width: '100%', border: '5px' }}>
          <tbody>{items}</tbody>
        </table>
      );
    }
  }

  renderAddModal() {
    return (
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={this.state.modalOpen === 'add'}
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

  renderEditModal() {
    return (
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={this.state.modalOpen === 'edit'}
        close={() => this.clearInput()}
      >
        <div>
          <h2>Edit Item</h2>

          <p>
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
            onClick={() => this.editItem()}
          >
            Edit Item
          </button>

          {this.state.errorMsg && <div>{this.state.errorMsg}</div>}
        </div>
      </Modal>
    );
  }

  render() {
    return (
      <div>
        {this.renderTable()}

        {this.props.canEdit && (
          <button
            type="button"
            className="btn btn-light"
            onClick={() => this.setState({ modalOpen: 'add' })}
          >
            Add Item
          </button>
        )}

        {this.renderAddModal()}
        {this.renderEditModal()}
      </div>
    );
  }
}

export default Wishlist;
