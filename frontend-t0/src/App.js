import React from 'react';
import MenuView from './components/MenuView';
import RoomView from './components/RoomView';
import AdminUserView from './components/AdminUserView';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import {Button} from 'react-bootstrap';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import Cookies from 'universal-cookie';
import {userJoinChatroomEvent, userJoinEvent} from "./components/events/chatroomEvents";

const cookies = new Cookies();

export const LOCAL = true;
export const BACKEND_HOST = LOCAL
  ? 'http://localhost:3001'
  : 'https://www.grupo21.ml';

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
  }

  componentDidMount() {
    const sessionID = cookies.get('sessionID');
    console.log("Session id:",sessionID);
    if (!sessionID || sessionID==='undefined' || sessionID==='null') {
      this.props.history.push('/sign-up');
    } else {
      console.log(`getting username, sessionID: ${sessionID}`);
      this.getUsername();
      userJoinEvent(this.state.name, key=>{

      });
    }
  }


  getUsername() {
    /*fetch(`${BACKEND_HOST}/users/username`)
            .then(res => res.json())
            .then(data => {
               this.setState({name: data.username});
            });*/
    this.setState({name: cookies.get('username')});
  }

  setCurrentRoomIdToAdminUserView() {
    this.sessionData = {name: this.state.name, roomId: -2};
    this.setState({roomId: -2});
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
    if(currentRoomId>=0) {
      userJoinChatroomEvent(currentRoomId, this.sessionData.name, socket, res => {

      });
    }
  }

  setRoomPassword(roomPassword) {
    this.sessionData = {
      name: this.state.name,
      roomId: this.state.roomId,
      roomPassword,
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
            </div>
            {this.state.roomId === -1 ? (
              <MenuView
                name={this.state.name}
                setCurrentRoomId={this.setCurrentRoomId}
                setRoomPassword={this.setRoomPassword}
              />
            ) : this.state.roomId === -2 ? (
              <AdminUserView
                sessionData={this.sessionData}
                setCurrentRoomId={this.setCurrentRoomId}
                addNotification={this.addNotification}
              />
            ) : (
              <RoomView
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

export default App;
