import React, { Component } from 'react';
import io from 'socket.io-client';
import './App.css';

import Home from 'views/Home';
import Create from 'views/Create';
import Join from 'views/Join';
import Lobby from 'views/Lobby';
import HowItWorks from 'views/HowItWorks';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: "home",
      roomCode: "",
      name: "",
    };
  }

  setRoom(roomCode, name) {
    this.socket = io('localhost:5000');
    this.socket.on('start', data => {
      this.setState({ view: "table" });
    });

    this.socket.on('close', data => {
      this.socket.disconnect();
      this.setState({ view: "home", roomCode: "", name: "" });
    });

    this.socket.on('disconnect', data => {
      this.setState({ view: "home", roomCode: "", name: "" });
    });

    this.setState({
      view: "lobby",
      roomCode,
      name,
    });
  }

  exitRoom() {
    this.socket.emit('exitRoom', {});
    this.socket.disconnect();
    this.setState({ viewState: "home", gameCode: "", name: "" });
  }

  render() {
    const views = {
      home:   <Home
                createRoom={ () => this.setState({ view: "create" }) }
                joinRoom={ () => this.setState({ view: "join" }) }
                viewHow={ () => this.setState({ view: "how" }) }/>,
      create: <Create
                goBack={ () => this.setState({ view: "home" }) }
                create={ (roomCode, name) => this.setRoom(roomCode, name) }/>,
      join:   <Join
                goBack={ () => this.setState({ view: "home" }) }
                join={ (roomCode, name) => this.setRoom(roomCode, name) }/>,
      lobby:  <Lobby
                socket={this.socket}
                roomCode={this.state.roomCode}
                name={this.state.name}
                exitRoom={ () => this.exitRoom() }/>,
      how: <HowItWorks goBack={ () => this.setState({ view: "home" }) }/>,
    }

    return (
      <div className="App d-flex justify-content-center">
        <div className="container" style={{ maxWidth: "500px" }}>
          <div>
            <h3>Secret Santa</h3>
          </div>

          <hr/>

          {views[this.state.view]}

          <hr/>

          <div>
            <small>built by <a href="http://brandon-wang.me">brandon wang</a></small>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
