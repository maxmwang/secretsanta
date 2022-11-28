import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';

import { checkCode, checkName, attemptJoin } from 'api/api';

class Join extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomCode: '',
      name: '',
      password: '',
      message: undefined,
    };
  }

  async joinGame() {
    checkCode(this.state.roomCode).then(res => {
      if (!res.valid) {
        this.setState({ message: res.message });
        return;
      }

      checkName(this.state.name).then(res => {
        if (!res.valid) {
          this.setState({ message: res.message });
          return;
        }

        attemptJoin(this.state.roomCode, this.state.name, this.state.password).then(res => {
          if (!res.valid) {
            this.setState({ message: res.message });
            return;
          }

          this.props.join(this.state.roomCode, this.state.name);
        });
      });
    });
  }

  render() {
    return (
      <div>
        <h5>Join Room</h5>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            this.joinGame();
          }}
        >
          <TextField
            fullWidth
            label="Room Code"
            variant="outlined"
            value={this.state.roomCode} 
            onChange={ e => this.setState({ roomCode: e.target.value.toLowerCase() }) }
          />
          <br/>
          <br/>
          <TextField
            fullWidth
            label="Name"
            type="name"
            variant="outlined"
            value={this.state.name} 
            onChange={ e => this.setState({ name: e.target.value }) }
          />
          <br/>
          <br/>
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            value={this.state.password}
            onChange={ e => this.setState({ password: e.target.value })}
          />
          <br/>
          <br/>

          <div className="row d-flex justify-content-center">
            <button type="button" className="btn btn-light" onClick={this.props.goBack}>Back</button>
            <button type="submit" className="btn btn-light">Join</button>
          </div>
        </form>

        {this.state.message && <div class="alert alert-danger" role="alert">
          {this.state.message}
        </div>}
      </div>
    );
  }
}

export default Join;
