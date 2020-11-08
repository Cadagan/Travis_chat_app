import React from "react";
import MenuView from "./components/MenuView";
import RoomView from "./components/RoomView";

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import {setSessionID, getSessionID, getUsername} from "./sessions";
import {Button} from "react-bootstrap";
import {NotificationContainer, NotificationManager} from 'react-notifications';

export const LOCAL = false;
export const BACKEND_HOST = LOCAL ? "http://localhost:3001" :"https://www.grupo21.ml" ;


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { roomId: -1, name: "" };
        this.setCurrentRoomId = this.setCurrentRoomId.bind(this);
        this.sessionData = { name: this.state.name, roomId: this.state.roomId };
        this.addNotification = this.addNotification.bind(this);
        this.removeSession = this.removeSession.bind(this);
    }

    componentDidMount() {
        const sessionID = getSessionID();
        if(sessionID !== null){
            this.getUsername();
        } else {
            this.props.history.push('/sign-up');
        }
    }

    getUsername(){
        /*fetch(`${BACKEND_HOST}/users/username`)
            .then(res => res.json())
            .then(data => {
               this.setState({name: data.username});
            });*/
        this.setState({name: getUsername()})
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

    setCurrentRoomId(currentRoomId) {
        this.sessionData = { name: this.state.name, roomId: currentRoomId };
        this.setState({ roomId: currentRoomId });
    }

    setName(name) {
        this.setState({ name: name });
    }

    removeSession(){
        fetch(`${BACKEND_HOST}/users/logout`,
            {
            method: 'POST'
        }).then(res => {
            //Log out successful
            if(res.status===200){
                setSessionID(null);
                this.props.history.push('/sign-in');
            }
        });
    }

    addNotification(message){
        NotificationManager.info(message, "New mention");
    }

    render() {
        return <div className={"viewport"}> {this.state.name ? (
                <div className={"App"}>
                    <NotificationContainer/>
                    <div>
                        <Button variant="danger" onClick={this.removeSession}>Log Out</Button>
                    </div>
                    {this.state.roomId === -1 ? (
                        <MenuView name={this.state.name} setCurrentRoomId={this.setCurrentRoomId} />
                    ) : (
                        <RoomView roomName={this.state.roomId} sessionData={this.sessionData} setCurrentRoomId={this.setCurrentRoomId}
                        addNotification={this.addNotification}/>
                    )}
                </div>) : <div/>
        } </div>
    };
}

export default App;
