import React, { Component } from 'react';

class Home extends Component {
  render() {
    return (
      <div>
        <div className="row d-flex justify-content-center">
          <button type="button" className="btn btn-light" onClick={this.props.joinRoom}>Join Room</button>
          <button type="button" className="btn btn-light" onClick={this.props.createRoom}>Create Room</button>
        </div>
      </div>
    );
  }
}

export default Home;
