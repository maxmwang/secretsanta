import React, { Component } from 'react';

import { checkName } from 'api/api';

class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      message: undefined,
    };
  }

  async createGame() {
    checkName(this.state.name).then(res => {
      if (!res.valid) {
        this.setState({ message: res.message });
        return;
      }
      this.props.create(this.state.name);
    });
  }

  render() {
    return (
      <div>
        <p>Create Room</p>

        <input type="name" className="form-control" placeholder="Enter your name" value={this.state.name} onChange={ e => this.setState({ name: e.target.value })}/>

        <br/>

        <div className="row d-flex justify-content-center">
          <button type="button" className="btn btn-light" onClick={this.props.goBack}>Back</button>
          <button type="button" className="btn btn-light" onClick={ () => this.createGame() }>Create</button>
        </div>

        {this.state.message && <div class="alert alert-danger" role="alert">
          {this.state.message}
        </div>}
      </div>
    );
  }
}

export default Create;
