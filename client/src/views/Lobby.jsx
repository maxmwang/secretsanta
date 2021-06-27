import React, { Component } from 'react';

import RoomCode from 'components/RoomCode';
import ParticipantList from 'components/ParticipantList';
import Participant from 'models/participant';

import WishlistPage from 'components/Wishlist/WishlistPage';

class Lobby extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'home',
      participants: {},
      santas: [],
      message: undefined,
      phase: 'standby',
    };
  }

  componentDidMount() {
    this.props.socket.emit('join', {
      name: this.props.name,
      roomCode: this.props.roomCode,
    });

    this.props.socket.on('phase', data => {
      this.setState({ phase: data.phase, message: undefined });
    });

    this.props.socket.on('participants', data => {
      let participants = {};
      data.participants.forEach(p => {
        participants[p.name] = new Participant(
          p.name,
          p.active,
          false,
          p.name === this.props.name
        );
      });
      this.setState({ participants });
    });

    this.props.socket.on('santas', data => {
      let santas = [];
      data.santas.forEach(name => {
        santas.push(new Participant(name, true, true));
      });

      this.setState({ santas });
    });

    this.props.socket.on('message', data => {
      this.setState({ message: data.message });
    });
  }

  renderHomeButtons() {
    if (this.state.phase === 'standby') {
      return [
        <button
          type="button"
          className="btn btn-light"
          onClick={() => this.props.socket.emit('voteMatch', {})}>
          Vote to Match Room
        </button>,
        <br/>,
        <br/>,
        <button type="button" className="btn btn-light" onClick={ () => this.props.exitRoom() }>
          Exit Room
        </button>
      ]
    } else if (this.state.phase === 'matched') {
      return [
      <div>
          <h6>You are Secret Santa for:</h6>
          <ParticipantList participants={this.state.santas} />
          <br/>
        </div>,
        <button
          type="button"
          className="btn btn-light"
          onClick={() => this.setState({ view: 'wishlist' })}>
          Wishlists
        </button>,
        <br/>,
        <br/>,
        <button type="button" className="btn btn-light" onClick={ () => this.props.socket.emit("voteClose", {}) } >
          Vote to Close Room
        </button>
      ]
    }
  }

  render() {
    const views = {
      home: (
        <div>
          <h6>Participants</h6>
          <ParticipantList participants={Object.values(this.state.participants)} />

          <br/>

          {this.renderHomeButtons()}

          <br/>
        </div>
      ),
      wishlist: (
        <WishlistPage
          socket={this.props.socket}
          roomId={this.props.roomCode}
          name={this.props.name}
          targetNames={this.state.santas.map(t => t.name)}
          returnHome={ () => this.setState({ view: 'home' })}
          canEdit
          canMark
        />
      ),
    };

    return (
      <div>
          <p>Lobby</p>
          <RoomCode roomCode={this.props.roomCode} />
          <br/>

          {views[this.state.view]}
          
          <br/>
          {this.state.message && (
            <div class="alert alert-danger" role="alert">
              {this.state.message}
            </div>
          )}
      </div>
    );
  }
}

export default Lobby;
