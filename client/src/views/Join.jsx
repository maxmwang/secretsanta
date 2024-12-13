import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';

import { checkCode, checkName, attemptJoin } from 'api/api';
import { BigButton } from 'components/Button';

class Join extends Component {
  constructor(props) {
    super(props);
    const { roomCode, name } = JSON.parse(localStorage.getItem("prev_room") || '{}');
    const preferredCode = props.urlCode || roomCode || '';
    // dont use saved name if the urlCode is not the same as saved code
    const preferredName = preferredCode === roomCode ? name : '';

    this.state = {
      roomCode: preferredCode,
      name: preferredName || '',
      password: '',
      message: undefined,
      rejoin: {
        active: false,
        roomCode,
        name,
      }
    };
  }

  async joinGame() {
    checkCode(this.state.roomCode).then(res => {
      if (!res.valid) {
        this.setState({ message: res.message });
        localStorage.setItem('prev_room', JSON.stringify('{}'));
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
      <div className="mt-24 md:mt-36">
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
            className="mb-4"
            label="Room Code"
            variant="outlined"
            size="small"
            value={this.state.roomCode} 
            onChange={ e => this.setState({ roomCode: e.target.value.toLowerCase() }) }
          />
          <TextField
            fullWidth
            className="mb-4"
            label="Name"
            type="name"
            variant="outlined"
            size="small"
            value={this.state.name} 
            onChange={ e => this.setState({ name: e.target.value }) }
          />
          <TextField
            fullWidth
            className="mb-4"
            label="Password"
            type="password"
            variant="outlined"
            size="small"
            value={this.state.password}
            onChange={ e => this.setState({ password: e.target.value })}
          />

          <div className="row d-flex justify-content-center">
            <BigButton type="button" className="btn btn-light mx-2" onClick={this.props.goBack}>Back</BigButton>
            <BigButton type="submit" className="btn btn-light mx-2">Join</BigButton>
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
