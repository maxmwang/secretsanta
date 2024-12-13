import React, { Component } from 'react';

import { BigButton, TextButton } from 'components/Button';

class Home extends Component {
  render() {
    return (
      <div className="mt-24 md:mt-36">
        <div className="m-4">
          <BigButton className="btn btn-light mx-2" onClick={this.props.joinRoom}>Join Room</BigButton>
        </div>
        <div className="m-4">
          <BigButton className="btn btn-light mx-2" onClick={this.props.createRoom}>Create Room</BigButton>
        </div>
        <div className="mt-16 mb-2">
          <TextButton onClick={this.props.viewHow}>How It Works</TextButton>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-tighter text-blue-400 inline-block mt-4">
            built by{' '}
            <a className="hover:no-underline hover:text-blue-400 border-b-2 transition ease-in-out duration-300 hover:border-blue-400 border-transparent " target="_blank" rel="noopener noreferrer" href="https://evonake.github.io" tabIndex="-1">
              max wang
            </a>
            {' '}and{' '}
            <a className="hover:no-underline hover:text-blue-400 border-b-2 transition ease-in-out duration-300 hover:border-blue-400 border-transparent " target="_blank" rel="noopener noreferrer" href="https://brandon-wang.com" tabIndex="-1">
              brandon wang
            </a>
          </p>
        </div>
      </div>
    );
  }
}

export default Home;
