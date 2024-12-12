import React, { Component } from 'react';

import { BigButton } from 'components/Button';

class Home extends Component {
  render() {
    return (
      <div>
        <div className="row d-flex justify-content-center">
          <BigButton className="btn btn-light" onClick={this.props.joinRoom}>Join Room</BigButton>
          <BigButton className="btn btn-light" onClick={this.props.createRoom}>Create Room</BigButton>
        </div>
        <br/>
        <div>
          <BigButton className="btn btn-light" onClick={this.props.viewHow}>How It Works</BigButton>
        </div>
      </div>
    );
  }
}

export default Home;
