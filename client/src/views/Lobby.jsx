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
    };
  }

  componentDidMount() {
    this.props.socket.emit('join', {
      name: this.props.name,
      roomCode: this.props.roomCode,
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

    this.props.socket.on('privated', data => {
      this.setState({ private: true });
    });

    this.props.socket.on('message', data => {
      this.setState({ message: data.message });
    });
  }

  render() {
    const views = {
      home: (
        <div>
          <p>Lobby</p>
          <RoomCode roomCode={this.props.roomCode} />

          <br />

          <h6>Participants</h6>
          <ParticipantList
            participants={Object.values(this.state.participants)}
          />

          <br />
          {!this.state.private && (
            <button
              type="button"
              className="btn btn-light"
              onClick={() => this.props.socket.emit('matchRoom', {})}
            >
              Match
            </button>
          )}

          {this.state.private && (
            <div>
              <h6>You are Secret Santa for:</h6>
              <ParticipantList participants={this.state.santas} />
              <br />
            </div>
          )}

          {this.state.private && (
            <button
              type="button"
              className="btn btn-light"
              onClick={() => this.setState({ view: 'wishlist' })}
            >
              Wishlists
            </button>
          )}
          <br />

          <br/>
          {!this.state.private ?
            <button type="button" className="btn btn-light" onClick={ () => this.props.exitRoom() }>
              Exit Room
            </button> :
            <button type="button" className="btn btn-light" onClick={ () => this.props.socket.emit("voteClose", {}) } >
              Vote to Close Room
            </button>
          }

          <br/>
          <br/>
          {this.state.message && (
            <div class="alert alert-danger" role="alert">
              {this.state.message}
            </div>
          )}
        </div>
      ),
      wishlist: (
        <WishlistPage
          socket={this.props.socket}
          roomId={this.props.roomCode}
          name={this.props.name}
          targetNames={this.state.santas.map(t => t.name)}
        />
      ),
    };

    return <div>{views[this.state.view]}</div>;
  }
}

export default Lobby;
