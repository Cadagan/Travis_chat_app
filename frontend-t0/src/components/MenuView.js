import React from 'react';
import RoomMenuComponent from './RoomMenuComponent';
import {AUTH_HOST, BACKEND_HOST} from '../App';
import {Form, Button} from 'react-bootstrap';
import axios from "axios";
const {withAuth0} = require("@auth0/auth0-react");

class MenuView extends React.Component {
  constructor(props) {
    super(props);
    this.name = props.name;
    this.state = {
      newRoomName: '',
      loadingRooms: true,
      rooms: [],
      privateForm: false,
      name: props.name,
    };
    this.setCurrentRoomId = props.setCurrentRoomId;
    this.setRoomPassword = props.setRoomPassword;
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleFormState = this.toggleFormState.bind(this);
    this.obtainAccessToken = props.obtainAccessToken;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {user} = this.props.auth0;
    if(user && this.state.rooms.length===0) {
      this.loadRooms();
    }
  }

  loadRooms() {
    this.obtainAccessToken(`http://localhost:3001`,'read:room').then(accessToken=>{
      axios.get(`${BACKEND_HOST}/rooms`, {
        headers: {
          'accept': 'application/json',
          'Accept-Language': 'en-US,en;q=0.8',
          'Content-Type': 'application/json',
          'mode': 'cors',
          'cache': 'default',
          'Authorization': `Bearer ${accessToken}`
        },
        withCredentials: true,
      }).then(r=>{
            this.setState({rooms: r.data});
          });
    })
  }

  handleChange(event) {
    this.setState({newRoomName: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    let password = '';
    if (this.state.privateForm) {
      password = prompt('Contraseña para el grupo', '');
    }
    const data = {
      roomName: this.state.newRoomName,
      private: this.state.privateForm,
      password: password,
    };
    this.obtainAccessToken(`http://localhost:3001`,'create:room').then(accessToken=> {
      axios.post(`${BACKEND_HOST}/rooms/new`, data, {
        headers: {
          'accept': 'application/json',
          'Accept-Language': 'en-US,en;q=0.8',
          'mode': 'cors',
          'cache': 'default',
          'Authorization': `Bearer ${accessToken}`
        },
        withCredentials: true,
      }).then(r => {
        this.loadRooms();
      });
    });
    this.setState({newRoomName: ''});
  }

  toggleFormState(event) {
    this.setState({privateForm: !this.state.privateForm});
  }
  componentWillReceiveProps(nextProps){
    this.forceUpdate();
    this.setState({name: nextProps.name});
  }

  render() {
    return (
      <div>
        <div>
          <div className={'container-rounded big-padding'}>
            <div className={'font-size-17 bold-text'}>
              <h1>&#128075; Hello, {this.state.name}!</h1>
            </div>
            <div className={'font-size-13 center-text'}>
              Welcome to Chat App, choose between any of the following chat
              rooms and join.
            </div>
          </div>
          <div className={'rooms-viewport'}>
            {this.state.rooms.length > 0 ? (
              this.state.rooms.map((room, i) => {
                return (
                  <div key={i}>
                    <RoomMenuComponent
                        obtainAccessToken={this.obtainAccessToken}
                      roomData={room}
                      setCurrentRoomId={this.setCurrentRoomId}
                      setRoomPassword={this.setRoomPassword}
                    />
                  </div>
                );
              })
            ) : (
              <h1>Rooms Loading</h1>
            )}
          </div>
        </div>
        <div className={'footer container-rounded'}>
          <div className={'float-left'}>
            <h5>Create a new Chat Room</h5>
            <p>To create a new chat room type the name here</p>
          </div>

          <div className={'form'}>
            <Form onSubmit={this.handleSubmit}>
              {this.state.privateForm ? (
                <div>
                  <Form.Group>
                    <Form.Control
                      type="text"
                      placeholder="Type the name here..."
                      onChange={this.handleChange}
                      id={'room-name-input'}
                      name={'name'}
                      value={this.state.newRoomName}
                    />
                  </Form.Group>
                  <input type="submit" value="CrearPrivada" />
                </div>
              ) : (
                <div>
                  <Form.Group>
                    <Form.Control
                      type="text"
                      placeholder="Type the name here..."
                      onChange={this.handleChange}
                      id={'room-name-input'}
                      name={'name'}
                      value={this.state.newRoomName}
                    />
                  </Form.Group>
                  <input type="submit" value="CrearPublica" />
                </div>
              )}
            </Form>
          </div>
          <div>
            <Button onClick={this.toggleFormState}>
              {this.state.privateForm ? 'Public Form' : 'Private Form'}
            </Button>
          </div>
        </div>
        {}
      </div>
    );
  }
}

export default withAuth0(MenuView);
