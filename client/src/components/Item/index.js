import React, { Component } from 'react';

import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import EditIcon from '@material-ui/icons/Edit';

import './index.css';

class Item extends Component {
  constructor() {
    super();
  }

  renderItemName() {
    let nameElem = this.props.item.name;
    try {
      new URL(this.props.item.link);
      // link is valid
      nameElem = (
        <a
          href={this.props.item.link}
          className="text-blue-400 border-b border-blue-400 hover:no-underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {this.props.item.name}
        </a>
      );
    } catch (_) {}

    return (
      <div className="wishlist-name text-lg font-semibold">
        {nameElem}
      </div>
    );
  }

  renderItemActions() {
    if (this.props.item.isRevealed()) {
      return this.props.item.marked_by !== undefined ? (
        <div style={{ color: "#f50057" }} className="font-semibold italic d-flex flex-row justify-content-end align-content-center">
          {this.props.item.marked_by}
          <CheckBoxIcon className="ml-1" color={'secondary'} />
        </div>
      ) : (
        <div className="text-right">
          <CheckBoxOutlineBlankIcon color='disabled' />
        </div>
      );
    } else if (this.props.canEdit) {
      return (
        <div className="wishlist-actions">
          <EditIcon
            className="cursor-pointer"
            onClick={this.props.onEdit}
          />
          <DeleteIcon
            className="cursor-pointer"
            onClick={this.props.onDelete}
          />
        </div>
      );
    } else {
      return this.props.item.isMarked() ? (
        <div className="wishlist-actions">
          <span/>
          <CheckBoxIcon onClick={this.props.onUnmark} color={this.props.item.canUnmark() ? 'secondary' : 'disabled'} />
        </div>
      ) : (
        <div className="wishlist-actions">
          <span/>
          <CheckBoxOutlineBlankIcon onClick={this.props.onMark} color='primary' />
        </div>
      );
    }
  }

  renderItemPrice() {
    let priceStr = this.props.item.price;
    if (!this.props.item.price.startsWith('$')) {
      priceStr = '$' + priceStr;
    }
    return (
      <div className="wishlist-price">{priceStr}</div>
    );
  }

  renderItemStyle() {
    if (this.props.item.style) {
      return <div className="wishlist-style text-sm text-blue-700">{this.props.item.style}</div>;
    }
    return <></>;
  }

  renderItemNotes() {
    if (this.props.item.notes) {
      return <div className="wishlist-notes mt-2">notes: {this.props.item.notes}</div>;
    }
    return <></>;
  }

  render() {
    return (
      <div className="wishlist-item">
        <div className="d-flex flex-row justify-between">
          {this.renderItemName()}  
          {this.renderItemPrice()}
        </div>
        {this.renderItemStyle()}
        {this.renderItemNotes()}
        <div className="flex-1"/>
        {this.renderItemActions()}
      </div>
    );
  }
}

export default Item;
