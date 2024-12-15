import React, { Component } from 'react';

import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';

import RoomCode from 'components/RoomCode';
import ParticipantList from 'components/ParticipantList';
import Participant from 'models/participant';

import WishlistPage from 'components/Wishlist/WishlistPage';
import Options from 'components/Options';
import { BigButton, SmallButton, TextButton } from 'components/Button';

const isAroundChristmas = () => {
  const today = new Date();
  if (today.getMonth() + 1 !== 12) {
    return false;
  }
  if (20 <= today.getDate() && today.getDate() <= 31) {
    return true;
  }
  return false;
}

class Lobby extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'home',
      participants: {},
      isAdmin: false,
      santas: [],
      restrictions: {},
      n_santas: 1,
      phase: '',
      error: undefined,
      success: undefined,
      changePassword: {
        open: false,
        newPassword: '',
      },
    };
  }

  componentDidMount() {
    this.props.socket.emit('join', {
      name: this.props.name,
      roomCode: this.props.roomCode,
      password: this.props.password,
    });

    this.props.socket.off('phase');
    this.props.socket.on('phase', data => {
      this.setState({ phase: data.phase, error: undefined });
    });

    this.props.socket.off('participants');
    this.props.socket.on('participants', data => {
      let participants = {};
      data.participants.forEach(p => {
        participants[p.name] = new Participant(
          p.name,
          p.active,
          this.state.santas.includes(p.name),
          p.name === this.props.name,
          p.isAdmin,
        );
        if (p.name === this.props.name) {
          this.setState({ isAdmin: p.isAdmin });
        }
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
      this.setState({ error: data.message });
    });

    this.props.socket.off('options');
    this.props.socket.on('options', data => {
      let options = data.options;
      this.setState({
        restrictions: options.restrictions,
        n_santas: options.n_santas,
      });
    });
  }

  renderHomeContent() {
    if (this.state.phase === '') {
      return <></>;
    }
    if (this.state.phase === 'standby') {
      return (
        <>
          <Options
            participants={this.state.participants}
            nSantas={this.state.n_santas}
            restrictions={this.state.restrictions}
            setSantas={(n) => this.props.socket.emit("setSantas", { n_santas: n })}
            removeRestriction={(name, target) => this.props.socket.emit("removeRestriction", { name, target })}
          />
          <BigButton type="button" className="btn btn-light" onClick={ () => this.props.exitRoom() }>
            Exit Room
          </BigButton>
        </>
      );
    }

    const participantList = <ParticipantList participants={this.state.santas.map(s => this.state.participants[s])} />;
    const wishlistButton = (
      <BigButton
        type="button"
        className="btn btn-light mb-4"
        onClick={() => this.setState({ view: 'wishlist' })}>
        Wishlists
      </BigButton>
    );
    const changePasswordButton = (
      <TextButton
        onClick={() => this.setState({ changePassword: { open: true } })}>
        Change Password
      </TextButton>
    );

    if (this.state.phase === 'matched') {
      return (
        <>
          <div className="mb-4">
            <p className="text-lg font-semibold text-blue-400">
              You are Secret Santa for:
            </p>
            {participantList}
          </div>
          {wishlistButton}
          <br/>
          {changePasswordButton}
        </>
      );
    } else if (this.state.phase === 'revealed') {
      return (
        <>
          <div className="mb-4">
            <p className="text-lg font-semibold text-blue-400">
              You were Secret Santa for:
            </p>
            {participantList}
          </div>
          {wishlistButton}
          <br/>
          {changePasswordButton}
        </>
      );
    }
  }

  renderAdminButtons() {
    if (!this.state.isAdmin) {
      return <></>;
    }
    if (this.state.phase === 'standby') {
      return (
        <div>
          <SmallButton
            important
            type="button"
            className="btn btn-light mb-4"
            onClick={() => this.props.socket.emit('adminMatch', {})}>
            Match Santas
          </SmallButton>
        </div>
      );
    } else if (this.state.phase === 'matched') {
      if (isAroundChristmas()) {
        return (
          <div>
            <SmallButton
              important
              type="button"
              className="btn btn-light mb-4"
              onClick={() => this.props.socket.emit('adminReveal', {})}>
              Reveal Santas
            </SmallButton>
          </div>
        );
      }
      return (
        <div className="mb-4 text-blue-400">
          <p>Santas can be revealed between 12/20 - 12/31</p>
        </div>
      );
    }
  }

  renderChangePasswordModal() {
    return (
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={this.state.changePassword.open}
        onClose={() => this.setState({
          changePassword: {
            open: false,
            value: '',
          },
        })}
      >
        <form
          className="wishlist-modal"
          onSubmit={e => {
            e.preventDefault();
            this.props.socket.emit("changePassword", { newPassword: this.state.changePassword.value });
            this.setState({ changePassword: { open: false }});
          }}
        >
          <h4 className="modal-title">Change Password</h4>
          <TextField
            label="New Password"
            variant="outlined"
            size="small"
            value={this.state.changePassword.value}
            onChange={e => this.setState({ changePassword: { open: true, value: e.target.value }})}
            required
          />
          <BigButton type="submit" className="btn btn-light">
            Submit
          </BigButton>
        </form>
      </Modal>
    );
  }

  render() {
    const views = {
      home: (
        <div>
          <h1 className="text-lg md:text-2xl font-semibold text-blue-400 inline-block mb-2">
            Participants
          </h1>
          <ParticipantList
            participants={Object.values(this.state.participants)}
            onClick={p => {
              if (this.state.phase === 'standby' && !p.self) {
                this.props.socket.emit('addRestriction', { target: p.name })
              }
            }}
          />

          <br/>

          {this.renderHomeContent()}

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
        <RoomCode
          roomCode={this.props.roomCode}
          copySuccess={() => this.setState({ success: 'Link successfully copied' })}
        />
        <br/>
        {this.renderAdminButtons()}

        {views[this.state.view]}

        <br/>
        {this.state.error && (
          <div class="alert alert-danger" role="alert">
            {this.state.error}
          </div>
        )}
        {this.state.success && (
          <div class="alert alert-success" role="alert">
            {this.state.success}
          </div>
        )}

        {this.renderChangePasswordModal()}
      </div>
    );
  }
}

export default Lobby;
