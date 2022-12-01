import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';

import { createRoom, checkName, attemptJoin } from 'api/api';

class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      password: '',
      message: undefined,
    };
  }

  async createGame() {
    checkName(this.state.name).then(res => {
      if (!res.valid) {
        this.setState({ message: res.message });
        return;
      }

      createRoom().then(res => {
        const { roomCode } = res;
        attemptJoin(roomCode, this.state.name, this.state.password).then(res => {
          if (!res.valid) {
            this.setState({ message: res.message });
            return;
          }

          this.props.create(roomCode, this.state.name);
        });
      });
    });
  }

  render() {
    return (
      <div>
        <p>Create Room</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            this.createGame();
          }}
        >
          <TextField
            fullWidth
            label="Name"
            type="name"
            variant="outlined"
            size="small"
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
            size="small"
            value={this.state.password}
            onChange={ e => this.setState({ password: e.target.value })}
          />
          <br/>
          <br/>

          <div className="row d-flex justify-content-center">
            <button type="button" className="btn btn-light" onClick={this.props.goBack}>Back</button>
            <button type="submit" className="btn btn-light">Create</button>
          </div>
        </form>

        {this.state.message && <div class="alert alert-danger" role="alert">
          {this.state.message}
        </div>}
      </div>
    );
  }
}

export default Create;
