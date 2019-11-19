import React, { Component } from 'react';

const style = {
    boxShadow: "0px 0px 5px 0px #21252999",
}

class Code extends Component {
  render() {
    return (
      <p>Room code: <span className="badge badge-secondary badge-light" style={style}>{this.props.roomCode}</span></p>
    );
  }
}

export default Code;
