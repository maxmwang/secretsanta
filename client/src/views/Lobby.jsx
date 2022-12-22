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
      voted: false,
    };
  }

  componentDidMount() {
    this.props.socket.emit('join', {
      name: this.props.name,
      roomCode: this.props.roomCode,
    });

    this.props.socket.off('phase');
    this.props.socket.on('phase', data => {
      this.setState({ phase: data.phase, message: undefined });
    });

    this.props.socket.off('participants');
    this.props.socket.on('participants', data => {
      let participants = {};
      data.participants.forEach(p => {
        participants[p.name] = new Participant(
          p.name,
          p.active,
          this.state.santas.includes(p.name),
          p.name === this.props.name
        );
      });
      this.setState({ participants });
    });

    this.props.socket.off('santas');
    this.props.socket.on('santas', data => {
      let participants = {...this.state.participants};
      Object.keys(participants).forEach(name => {
        participants[name].santa = data.santas.includes(name);
      })
      this.setState({
        participants,
        santas: data.santas,
      });
    });

    this.props.socket.off('message');
    this.props.socket.on('message', data => {
      this.setState({ message: data.message, voted: false });
    });
  }

  voteToMatch() {
    this.props.socket.emit('voteMatch', {});
    this.setState({ voted: true });
  }

  renderHomeButtons() {
    if (this.state.phase === 'standby') {
      return (
          <>
            <button
              type="button"
              className="btn btn-light"
              onClick={() => this.voteToMatch()}
              disabled={this.state.voted}>
              {this.state.voted ? 'Already Voted!' : 'Vote to Match Room'}
            </button>
            {!this.state.voted && (
              <>
                <br/>
                <br/>
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={ () => this.props.exitRoom() }
                  >
                  Exit Room
                </button>
              </>
            )}
          </>
        );
    } else if (this.state.phase === 'matched') {
      return (
        <>
          <div>
            <h6>You are Secret Santa for:</h6>
            <ParticipantList participants={this.state.santas.map(s => this.state.participants[s])} />
            <br/>
          </div>
          <button
            type="button"
            className="btn btn-light"
            onClick={() => this.setState({ view: 'wishlist' })}>
            Wishlists
          </button>
          <br/>
          <br/>
          <button type="button" className="btn btn-light" onClick={ () => this.props.socket.emit("voteClose", {}) } >
            Vote to Close Room
          </button>
        </>
      );
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
          participants={Object.values(this.state.participants)}
          returnHome={ () => this.setState({ view: 'home' })}
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
