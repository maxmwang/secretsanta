import React, { Component } from 'react';

import { checkName, checkCode } from 'api/api';

class Join extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomCode: '',
      name: '',
      message: undefined,
    };
  }

  async joinGame() {
    checkCode(this.state.roomCode).then(res => {
      if (!res.valid) {
        this.setState({ message: res.message });
        return;
      }

      checkName(this.state.name, this.state.roomCode).then(res => {
        if (!res.valid) {
          this.setState({ message: res.message });
          return;
        }

        this.props.join(this.state.roomCode, this.state.name);
      });
    });
  }

  render() {
    return (
      <div>
        <h5>Join Room</h5>

        <input type="name" className="form-control" placeholder="Enter room code" 
          value={this.state.roomCode} 
          onChange={ e => this.setState({ roomCode: e.target.value }) }/>
        <br/>
        <input type="name" className="form-control" placeholder="Enter your name" 
          value={this.state.name} 
          onChange={ e => this.setState({ name: e.target.value }) }/>

        <br/>

        <div className="row d-flex justify-content-center">
          <button type="button" className="btn btn-light" onClick={this.props.goBack}>Back</button>
          <button type="button" className="btn btn-light" onClick={ () => this.joinGame() }>Join</button>
        </div>

        {this.state.message && <div class="alert alert-danger" role="alert">
          {this.state.message}
        </div>}
      </div>
    );
  }
}

export default Join;
