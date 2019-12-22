import React, { Component } from 'react';

import RoomCode from 'components/RoomCode';
import ParticipantList from 'components/ParticipantList';
import Participant from 'models/participant';

import { getParticipant } from 'database/Participant';
import { setTargets } from 'database/Participant';

import WishlistPage from 'components/WishlistPage';

class Lobby extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'lobby',
      participants: {},
      santas: [],
      message: undefined,
    };
  }

  componentDidMount() {
    this.props.socket.emit('join', { name: this.props.name, roomCode: this.props.roomCode });

    this.props.socket.on('participants', data => {
      let participants = {};
      data.participants.forEach(p => {
        participants[p.name] = new Participant(p.name, p.active, false, p.name === this.props.name);
      });
      this.setState({ participants });
    });

    this.props.socket.on('santas', data => {
      let santas = [];
      data.santas.forEach(name => {
        santas.push(new Participant(name, true, true));
      });

      this.setState({ santas });

      setTargets(this.props.roomCode, this.props.name, santas.map((s) => s.name));
    });

    this.props.socket.on('message', data => {
      this.setState({ message: data.message });
    })
  }

  render() {
    const views = {
      lobby: <div>
                <p>Lobby</p>
                <RoomCode roomCode={this.props.roomCode}/>

                <br/>

                <h6>Participants</h6>
                <ParticipantList participants={Object.values(this.state.participants)}/>

                <br/>
                {!this.state.private &&
                  <button type="button" className="btn btn-light" onClick={ () => this.props.socket.emit('matchRoom', {}) }>
                    {this.state.santas.length > 0 ? 'Rematch' : 'Match'}
                  </button>
                }

                {this.state.santas.length > 0 &&
                  <div>
                    <br/>
                    <h6>You are Secret Santa for:</h6>

                    <br/>
                    <ParticipantList participants={this.state.santas}/>

                    <br/>
                    {!this.state.private &&
                      <button
                        type="button"
                        className="btn btn-light"
                        onClick={ () => this.props.socket.emit('confirmMatch', {}) }>
                        Confirm
                      </button>
                    }
                  </div>
                }

                <br/>
                {this.state.message && <div class="alert alert-danger" role="alert">
                  {this.state.message}
                </div>}

                <br/>
                <button type="button" className="btn btn-light" onClick={ () => this.props.socket.emit('closeRoom', {}) }>
                  Close Room
                </button>
              </div>,
      wishlist: <WishlistPage roomId={this.props.roomCode} name={this.props.name} targetNames={this.state.santas.map((t) => t.name)} />
    }

    return (
      <div>
        {views[this.state.view]}
      </div>
    );
  }
}

export default Lobby;
