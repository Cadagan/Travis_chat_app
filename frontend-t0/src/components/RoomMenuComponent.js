import React from 'react';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

export default class RoomMenuComponent extends React.Component {
  constructor(props) {
    super(props);
    this.roomName = props.roomData['roomName'];
    this.setCurrentRoomId = props.setCurrentRoomId;
    this.roomId = props.roomData['roomId'];
    this.role = cookies.get('role');
  }

  render() {
    return (
      <div className={'container-rounded separate-small small-padding'}>
        <div className={'join-room-btn float-right'}>
          <button
            type={'submit'}
            onClick={() => this.setCurrentRoomId(this.roomId)}>
            Unirse
          </button>
          {this.role == 'admin' ? (
            <button
              type={'submit'}
              onClick={() => console.log('Clicked delete button')}>
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
