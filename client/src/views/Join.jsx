import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';

import { checkCode, checkName, attemptJoin } from 'api/api';
import { BigButton } from 'components/Button';

class Join extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomCode: props.urlCode || '',
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

      const cleanedName = this.state.name.toLowerCase().replaceAll(' ', '');
      checkName(cleanedName).then(res => {
        if (!res.valid) {
          this.setState({ message: res.message });
          return;
        }

        attemptJoin(this.state.roomCode, cleanedName, this.state.password).then(res => {
          if (!res.valid) {
            this.setState({ message: res.message });
            return;
          }

          this.props.join(this.state.roomCode, cleanedName);
        });
      });
    });
  }

  render() {
    return (
      <div>
        <h1 className="text-lg md:text-2xl font-semibold text-blue-400 inline-block mb-2">
          Join Room
        </h1>

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
            size="small"
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
            <BigButton type="button" className="btn btn-light" onClick={this.props.goBack}>Back</BigButton>
            <BigButton type="submit" className="btn btn-light">Join</BigButton>
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
