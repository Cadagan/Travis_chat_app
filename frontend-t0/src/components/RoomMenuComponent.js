import React from 'react';

export default class RoomMenuComponent extends React.Component{
    constructor(props) {
        super(props);
        this.roomName = props.roomData["roomName"];
        this.setCurrentRoomId = props.setCurrentRoomId;
        this.roomId = props.roomData["roomId"];
    }

    render() {
        return (
            <div className={"container-rounded separate-small small-padding"}>
                <div className={"join-room-btn float-right"}>
                    <button type={"submit"} onClick={()=>this.setCurrentRoomId(this.roomId)}>Unirse</button>
                </div>
                <div className={"font-size-12"}>
                    Chat Room #{this.roomId}
                </div>
                <div className={"menu-room-name bold-text"}>
                    {this.roomName}
                </div>
            </div>
        );
    }
}
