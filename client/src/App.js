import React, { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import './App.css';

import { useHistory, useParams } from "react-router-dom";

import Home from 'views/Home';
import Create from 'views/Create';
import Join from 'views/Join';
import Lobby from 'views/Lobby';
import HowItWorks from 'views/HowItWorks';

function App() {
  const history = useHistory();
  const { urlroomcode } = useParams();

  const [view, setView] = useState("home");
  const [roomCode, setRoomCode] = useState("");
  const [name, setName] = useState("");
  const [socket, setSocket] = useState(undefined);
  const [urlCode, setURLCode] = useState(undefined);

  const goHome = useCallback(() => {
    history.push('/');
    setURLCode(undefined);
    setView("home");
    setRoomCode("");
    setName("");
  }, [history]);

  useEffect(() => {
    if (view === "home" && urlroomcode !== undefined && urlroomcode.length !== 0) {
      setURLCode(urlroomcode);
      setView("join");
    }
  }, [view, goHome, urlroomcode, history]);

  const setRoom = (roomCode, name) => {
    const socket = io();
    setSocket(socket);

    socket.on('close', data => {
      socket.disconnect();
      goHome();
    });

    socket.on('disconnect', data => {
      goHome();
    });

    setRoomCode(roomCode);
    setName(name);
    setView("lobby");
    history.push(`/${roomCode}`);
  }

  const exitRoom = () => {
    socket.disconnect();
    goHome();
    setSocket(undefined);
  }

  const views = {
    home:   <Home
              createRoom={ () => setView("create") }
              joinRoom={ () => setView("join") }
              viewHow={ () => setView("how") }/>,
    create: <Create
              goBack={ () => goHome() }
              create={ (roomCode, name) => setRoom(roomCode, name) }/>,
    join:   <Join
              urlCode={urlCode}
              goBack={ () => goHome() }
              join={ (roomCode, name) => setRoom(roomCode, name) }/>,
    lobby:  <Lobby
              socket={socket}
              roomCode={roomCode}
              name={name}
              exitRoom={ () => exitRoom() }/>,
    how: <HowItWorks goBack={ () => goHome() }/>,
  }

  return (
    <div className="App d-flex justify-content-center">
      <div className="container" style={{ maxWidth: "500px" }}>
        <div>
          <h3>Secret Santa</h3>
        </div>

        <hr/>

        {views[view]}

        <hr/>

        <div>
          <small>built by <a href="https://evonake.github.io">max wang</a> and <a href="https://brandon-wang.me">brandon wang</a></small>
        </div>
      </div>
    </div>
  );
}

export default App;
