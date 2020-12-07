import React from 'react';
import MenuView from './components/MenuView';
import RoomView from './components/RoomView';
import AdminUserView from './components/AdminUserView';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import {Button} from 'react-bootstrap';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import Cookies from 'universal-cookie';
import {userJoinEvent} from './components/events/chatroomEvents';
import {withAuth0} from '@auth0/auth0-react';

const cookies = new Cookies();

export const LOCAL = false;
export const BACKEND_HOST = LOCAL
  ? 'http://localhost:3001'
  : 'https://www.grupo21.ml';
export const AUTH_HOST = LOCAL ? 'http://localhost:3002' : 'https://grupo21.ml';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {roomId: -1, name: '', roomPassword: ''};
    this.setCurrentRoomId = this.setCurrentRoomId.bind(this);
    this.setRoomPassword = this.setRoomPassword.bind(this);
    this.sessionData = {
      name: this.state.name,
      roomId: this.state.roomId,
      roomPassword: this.state.roomPassword,
    };
    this.addNotification = this.addNotification.bind(this);
    this.removeSession = this.removeSession.bind(this);
    this.setCurrentRoomIdToAdminUserView = this.setCurrentRoomIdToAdminUserView.bind(
      this,
    );
    this.setCurrentRoomIdToAdminMonitorView = this.setCurrentRoomIdToAdminMonitorView.bind(
      this,
    );
    this.obtainAccessToken = this.obtainAccessToken.bind(this);
  }

  componentDidMount() {
    const sessionID = cookies.get('sessionID');
    console.log('Session id:', sessionID);
    if (
      (!sessionID || sessionID === 'undefined' || sessionID === 'null') &&
      !sessionStorage.getItem('a0.spajs.txs')
    ) {
      this.props.history.push('/sign-up');
    } else {
      console.log(`getting username, sessionID: ${sessionID}`);
      this.getUsername();
    }
  }
  async componentDidUpdate(prevProps, prevState, snapshot) {
    const {user} = this.props.auth0;
    if (user) {
      cookies.set('sessionID', user.sub);
      cookies.set('token', user.sub);
      cookies.set('username', user.nickname);
      cookies.set('role', 'user');
      this.getUsername();
      let data = {username: cookies.get('username')};
      fetch(`${BACKEND_HOST}/users/signin`, {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(data), // data can be `string` or {object}!
        //credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(data => {
          cookies.set('role', data.role);
        });
    }
  }

  getUsername() {
    /*fetch(`${BACKEND_HOST}/users/username`)
            .then(res => res.json())
            .then(data => {
               this.setState({name: data.username});
            });*/
    if (this.state.name !== cookies.get('username')) {
      this.setState({name: cookies.get('username')});
    }
    if (this.state.name && this.state.name !== 'null') {
      userJoinEvent(this.state.name, key => {});
    }
  }

  setCurrentRoomIdToAdminUserView() {
    this.sessionData = {name: this.state.name, roomId: -2};
    this.setState({roomId: -2});
  }
  setCurrentRoomIdToAdminMonitorView() {
    this.sessionData = {name: this.state.name, roomId: -2};
    this.setState({roomId: -3});
  }

  async obtainAccessToken(audience, scope) {
    const {getAccessTokenSilently, user} = this.props.auth0;
    const accessToken = await getAccessTokenSilently({
      audience: audience,
      scope: scope,
    });
    return accessToken;
  }

  /* changeName() {
        let name = "";
        name = prompt("Please enter your name:", "");
        if (name != null && name !== "") {
            this.setState({ name: name });
        } else {
            this.changeNameValid();
        }
    }

    changeNameValid() {
        let name = "";
        while (name === "") {
            name = prompt("Please enter your name:", "");
            if (name != null && name !== "") {
                this.setState({ name: name });
            }
        }
    }*/

  setCurrentRoomId(currentRoomId, socket) {
    this.sessionData = {name: this.state.name, roomId: currentRoomId};
    this.setState({roomId: currentRoomId});
  }

  setRoomPassword(roomPassword) {
    this.sessionData = {
      name: this.state.name,
      roomId: this.state.roomId,
      roomPassword: roomPassword,
    };
    this.setState({roomPassword: roomPassword});
  }

  setName(name) {
    this.setState({name: name});
  }

  removeSession() {
    fetch(`${BACKEND_HOST}/users/logout`, {
      method: 'POST',
    }).then(res => {
      //Log out successful
      if (res.status === 200) {
        cookies.set('sessionID', null);
        cookies.set('token', null);
        cookies.set('role', null);
        cookies.set('username', null);
        this.props.history.push('/sign-in');
      }
    });
  }

  addNotification(message) {
    NotificationManager.info(message, 'New mention');
  }

  render() {
    return (
      <div className={'viewport'}>
        {' '}
        {this.state.name ? (
          <div className={'App'}>
            <NotificationContainer />
            <div>
              <Button variant="danger" onClick={this.removeSession}>
                Log Out
              </Button>
              {cookies.get('role') == 'admin' ? (
                <Button onClick={this.setCurrentRoomIdToAdminUserView}>
                  Ver usuarios
                </Button>
              ) : (
                <div></div>
              )}
              {cookies.get('role') == 'admin' ? (
                <Button onClick={this.setCurrentRoomIdToAdminMonitorView}>
                  Ver monitoreo
                </Button>
              ) : (
                <div></div>
              )}
            </div>
            {this.state.roomId === -1 ? (
              <MenuView
                name={this.state.name}
                setCurrentRoomId={this.setCurrentRoomId}
                setRoomPassword={this.setRoomPassword}
                obtainAccessToken={this.obtainAccessToken}
              />
            ) : this.state.roomId === -2 ? (
              <AdminUserView
                obtainAccessToken={this.obtainAccessToken}
                sessionData={this.sessionData}
                setCurrentRoomId={this.setCurrentRoomId}
                addNotification={this.addNotification}
              />
            ) : this.state.roomId === -3 ? (
              <MonitorComponent
                obtainAccessToken={this.obtainAccessToken}
                sessionData={this.sessionData}
                setCurrentRoomId={this.setCurrentRoomId}
                addNotification={this.addNotification}
              />
            ) : (
              <RoomView
                obtainAccessToken={this.obtainAccessToken}
                roomName={this.state.roomId}
                sessionData={this.sessionData}
                setCurrentRoomId={this.setCurrentRoomId}
                addNotification={this.addNotification}
              />
            )}
          </div>
        ) : (
          <div />
        )}{' '}
      </div>
    );
  }
}

export default withAuth0(App);

