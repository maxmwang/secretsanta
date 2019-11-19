import React, { Component } from 'react';
import io from 'socket.io-client';
import './App.css';

import { createGame } from 'api/api';

import Home from 'views/Home';
import Create from 'views/Create';
import Join from 'views/Join';
import Lobby from 'views/Lobby';

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
    this.socket = io();
    this.socket.on('start', data => {
      this.setState({ view: "table" });
    });

    this.socket.on('end', data => {
      this.exitGame();
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

  render() {
    const views = {
      home:   <Home 
                createRoom={ () => this.setState({ view: "create" }) } 
                joinRoom={ () => this.setState({ view: "join" }) }/>,
      create: <Create
                goBack={ () => this.setState({ view: "home" }) }
                create={ name => createGame().then(res => this.setRoom(res.roomCode, name)) }/>,
      join:   <Join
                goBack={ () => this.setState({ view: "home" }) }
                join={ (roomCode, name) => this.setRoom(roomCode, name) }/>,
      lobby:  <Lobby
                socket={this.socket}
                roomCode={this.state.roomCode}
                name={this.state.name}
                exitGame={ () => this.exitGame() }/>,
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