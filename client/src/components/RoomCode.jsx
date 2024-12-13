import React, { Component } from 'react';

const style = {
    boxShadow: "0px 0px 5px 0px #21252999",
}

class Code extends Component {
  copyLink() {
    const el = document.createElement('textarea');
    el.value = window.location.href;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    this.props.copySuccess();
  };

  render() {
    return (
      <p className="text-lg font-semibold text-blue-400">Room code:
        <span onClick={() => this.copyLink()} className="badge badge-secondary badge-light m-2 cursor-pointer" style={style}>{this.props.roomCode}</span>
      </p>
    );
  }
}

export default Code;
