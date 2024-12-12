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
      <div className="container">
        <div>
          <h1 className="text-3xl md:text-5xl font-semibold text-blue-400 inline-block mb-4">
            Secret Santa
          </h1>
        </div>

        {views[view]}

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
    </div>
  );
}

export default App;
