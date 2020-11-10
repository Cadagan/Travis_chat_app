import React from 'react';
import Cookies from 'universal-cookie';
import {BACKEND_HOST} from '../App';
const cookies = new Cookies();

export default class RoomMenuComponent extends React.Component {
  constructor(props) {
    super(props);
    this.roomName = props.roomData['roomName'];
    this.setCurrentRoomId = props.setCurrentRoomId;
    this.setRoomPassword = props.setRoomPassword;
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
      let password = prompt('Password');
    }
    let data = {roomid: this.roomId, password: this.password};
    fetch(`${BACKEND_HOST}/rooms/join`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(r => r.json())
      .then(r => {
        console.log(r);
        if (r.passwordCorrect === 'true') {
          this.setCurrentRoomId(this.roomId);
          this.setRoomPassword(this.password);
        } else {
          alert('Wrong password :)');
        }
      });
  }

  deleteRoom() {
    let data = {roomid: this.roomId};
    console.log(`deleting room with room id: ${this.roomId}`);
    fetch(`${BACKEND_HOST}/admin/deleteRoom`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
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
