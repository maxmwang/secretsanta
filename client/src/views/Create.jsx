import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';

import { createRoom, checkName, attemptJoin } from 'api/api';
import { BigButton } from 'components/Button';

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
    const cleanedName = this.state.name.toLowerCase().replaceAll(' ', '');
    checkName(cleanedName).then(res => {
      if (!res.valid) {
        this.setState({ message: res.message });
        return;
      }

      createRoom().then(res => {
        const { roomCode } = res;
        attemptJoin(roomCode, cleanedName, this.state.password).then(res => {
          if (!res.valid) {
            this.setState({ message: res.message });
            return;
          }

          this.props.setPassword(this.state.password);
          this.props.create(roomCode, cleanedName);
        });
      });
    });
  }

  render() {
    return (
      <div className="mt-24 md:mt-36">
        <h1 className="text-lg md:text-2xl font-semibold text-blue-400 inline-block mb-2">
          Create Room
        </h1>

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
            <BigButton type="button" className="btn btn-light mx-2" onClick={this.props.goBack}>Back</BigButton>
            <BigButton type="submit" className="btn btn-light mx-2">Create</BigButton>
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
