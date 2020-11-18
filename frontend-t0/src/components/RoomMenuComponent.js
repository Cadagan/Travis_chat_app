import React from 'react';
import Cookies from 'universal-cookie';
import {BACKEND_HOST} from '../App';
import {setPrivateRoom} from "./events/chatroomEvents";
import axios from "axios";
const cookies = new Cookies();
const {withAuth0} = require("@auth0/auth0-react");

class RoomMenuComponent extends React.Component {
  constructor(props) {
    super(props);
    this.roomName = props.roomData['roomName'];
    this.setCurrentRoomId = props.setCurrentRoomId;
    this.setRoomPassword = props.setRoomPassword;
    this.obtainAccessToken = props.obtainAccessToken;
    this.roomId = props.roomData['roomId'];
    this.private = props.roomData['private'];
    this.password = props.roomData['password'];
    this.role = cookies.get('role');
    this.joinRoom = this.joinRoom.bind(this);
    this.deleteRoom = this.deleteRoom.bind(this);
  }

  joinRoom() {
    let password = '';
    if (this.private) {
      password = prompt('Password');
    }
    let data = {roomid: this.roomId, password: password};
    this.obtainAccessToken(`http://localhost:3001`,'interact:room').then(accessToken=> {
      axios.post(`${BACKEND_HOST}/rooms/join`, data, {
        headers: {
          'accept': 'application/json',
          'Accept-Language': 'en-US,en;q=0.8',
          'mode': 'cors',
          'cache': 'default',
          'Authorization': `Bearer ${accessToken}`
        },
        withCredentials: true,
      })
          .then(r => {
            r = r.data;
            console.log(r);
            if (r.passwordCorrect === 'true') {
              setPrivateRoom(this.private);
              this.setCurrentRoomId(this.roomId);
              this.setRoomPassword(this.password);
            } else {
              alert('Wrong password :)');
            }
          });
    });
  }

  deleteRoom() {
    let data = {roomid: this.roomId};
    console.log(`deleting room with room id: ${this.roomId}`);
    this.obtainAccessToken(`http://localhost:3001`,'delete:room').then(accessToken=> {
      axios.post(`${BACKEND_HOST}/admin/deleteRoom`, data, {
        headers: {
          'accept': 'application/json',
          'Accept-Language': 'en-US,en;q=0.8',
          'mode': 'cors',
          'cache': 'default',
          'Authorization': `Bearer ${accessToken}`
        },
        withCredentials: true,
      })
    });
    window.location.reload();
  }

  render() {
    return (
      <div className={'container-rounded separate-small small-padding'}>
        <div className={'join-room-btn float-right'}>
          <button type={'submit'} onClick={this.joinRoom}>
            Unirse
          </button>
          {this.role == 'admin' ? (
            <button type={'submit'} onClick={this.deleteRoom}>
              Eliminar
            </button>
          ) : (
            <div></div>
          )}
        </div>
        <div className={'font-size-12'}>Chat Room #{this.roomId}</div>
        <div className={'menu-room-name bold-text'}>{this.roomName}</div>
      </div>
    );
  }
}
export default withAuth0(RoomMenuComponent);