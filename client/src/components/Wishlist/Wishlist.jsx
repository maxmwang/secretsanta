import React, { Component } from 'react';

import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import CloseIcon from '@material-ui/icons/Close';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import EditIcon from '@material-ui/icons/Edit';

import Item from 'models/item';

import './Wishlist.css';

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

  verifyInput() {
    let missingInput;
    if (!this.state.input.name) {
      missingInput = 'Name';
    } else if (!this.state.input.price) {
      missingInput = 'Price';
    }
    if (missingInput) {
      this.setState({ errorMsg: `${missingInput} is required.` });
      return false;
    }

    try {
      new URL(this.state.input.link);
    } catch (_) {
      this.setState({ errorMsg: 'Invaild link.' });
      return false;
    }

    return true;
  }

  addItemToWishlist() {
    if (!this.verifyInput()) {
      return;
    }

    const newItem = new Item(
      '',
      this.state.input.name,
      this.state.input.price,
      this.state.input.link,
      this.state.input.style,
      this.state.input.notes,
      undefined,
      undefined,
    );
    this.props.socket.emit('addItem', { item: newItem });

    this.clearInput();
  }

  removeItemFromWishlist(itemId) {
    this.props.socket.emit('removeItem', { id: itemId });
  }

  editItem() {
    if (!this.verifyInput()) {
      return;
    }

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
        <div className="wishlist-actions">
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
          <CloseIcon
            style={{ cursor: 'pointer' }}
            fontSize="small"
            onClick={() => this.removeItemFromWishlist(item.id)}
          />
        </div>
      );
    } else {
      return item.isMarked() ? (
        <div className="wishlist-actions">
          <CheckBoxIcon onClick={() => this.unmarkItem(item.id)} color={item.canUnmark() ? 'secondary' : 'disabled'} />
        </div>
      ) : (
        <div className="wishlist-actions">
          <CheckBoxOutlineBlankIcon onClick={() => this.markItem(item.id)} color='primary' />
        </div>
      );
    }
  }

  markItem(id) {
    this.props.socket.emit('markItem', {
      target: this.props.target,
      itemId: id,
    });
  }

  unmarkItem(id) {
    this.props.socket.emit('unmarkItem', {
      target: this.props.target,
      itemId: id,
    });
  }

  renderTable() {
    const items = [];

    if (this.props.items) {
      for (let item of this.props.items) {
        const styleTemp = item.style ? item.style : 'N/A';
        const notesTemp = item.notes ? item.notes : 'N/A';
        let linkTemp;
        try {
          linkTemp = new URL(item.link);
        } catch (_) {}

        items.push(
          <div className="wishlist-item">
            <div className="wishlist-item-top">
              <div className="wishlist-name">
                {linkTemp ? <a href={item.link} target="_blank">{item.name}</a> : item.name}
              </div>
              {this.renderItemAction(item)}
            </div>
            <div className="wishlist-price">{item.price.startsWith('$') ? '' : '$'}{item.price}</div>
            { item.style &&
              <div className="wishlist-style">Style: {item.style}</div>
            }
            { item.notes &&
              <div className="wishlist-notes">Notes: {item.notes}</div>
            }
          </div>
        );
      }

      return (
        <div className="wishlist">
          {items}
        </div>
      );
    }
  }

  renderAddModal() {
    return (
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={this.state.modalOpen === 'add'}
        onClose={() => this.clearInput()}
      >
        <div className="add-item-modal">
          <h4 className="modal-title">Add Item</h4>
          <TextField
            label="Name"
            variant="outlined"
            size="small"
            value={this.state.input.name}
            onChange={e => this.modifyInput('name', e.target.value)}
            required
          />
          <TextField
            label="Price"
            type="number"
            variant="outlined"
            size="small"
            value={this.state.input.price}
            onChange={e => this.modifyInput('price', e.target.value)}
            required
          />
          <TextField
            label="Link"
            variant="outlined"
            size="small"
            value={this.state.input.link}
            onChange={e => this.modifyInput('link', e.target.value)}
          />
          <TextField
            label="Style"
            variant="outlined"
            size="small"
            value={this.state.input.style}
            onChange={e => this.modifyInput('style', e.target.value)}
          />
          <TextField
            label="Notes"
            variant="outlined"
            size="small"
            value={this.state.input.notes}
            onChange={e => this.modifyInput('notes', e.target.value)}
          />
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
        onClose={() => this.clearInput()}
      >
        <div className="edit-item-modal">
          <h4 className="modal-title">Edit Item</h4>
          <TextField
            label="Price"
            type="number"
            variant="outlined"
            size="small"
            value={this.state.input.price}
            onChange={e => this.modifyInput('price', e.target.value)}
            required
          />
          <TextField
            label="Link"
            variant="outlined"
            size="small"
            value={this.state.input.link}
            onChange={e => this.modifyInput('link', e.target.value)}
          />
          <TextField
            label="Style"
            variant="outlined"
            size="small"
            value={this.state.input.style}
            onChange={e => this.modifyInput('style', e.target.value)}
          />
          <TextField
            label="Notes"
            variant="outlined"
            size="small"
            value={this.state.input.notes}
            onChange={e => this.modifyInput('notes', e.target.value)}
          />
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
          <>
            <br/>
            <button
              type="button"
              className="btn btn-light"
              onClick={() => this.setState({ modalOpen: 'add' })}
            >
              Add Item
            </button>
          </>
        )}

        {this.renderAddModal()}
        {this.renderEditModal()}
      </div>
    );
  }
}

export default Wishlist;
