import React, { Component } from 'react';

import RoomCode from 'components/RoomCode';
import ParticipantList from 'components/ParticipantList';
import Participant from 'models/participant';

class Lobby extends Component {
  constructor(props) {
    super(props);
    this.state = {
      participants: {},
      santas: [],
    };
  }

  componentDidMount() {
    this.props.socket.emit('join', { name: this.props.name, roomCode: this.props.roomCode });

    this.props.socket.on('participants', data => {
      let participants = {};
      data.participants.forEach(p => {
        participants[p.name] = new Participant(p.name, p.active, false);
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
  }

  render() {
    return (
      <div>
        <p>Lobby</p>
        <RoomCode roomCode={this.props.roomCode}/>
        
        <br/>

        <h6>Participants</h6>
        <ParticipantList participants={Object.values(this.state.participants)}/>

        <br/>
        <button type="button" className="btn btn-light" onClick={ () => this.props.socket.emit('matchRoom', {}) }>Match</button>

        <br/>
        <h6>Match Results</h6>
        <ParticipantList participants={this.state.santas}/>
      </div>
    );
  }
}

export default Lobby;
