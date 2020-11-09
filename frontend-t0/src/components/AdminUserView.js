import React, {useRef} from 'react';
import UserView from './UserView';
import {animateScroll} from 'react-scroll';
import io from 'socket.io-client';
import {BACKEND_HOST, LOCAL} from '../App';
import axios from 'axios';
import $ from 'jquery';

export default class AdminUserView extends React.Component {
  constructor(props) {
    super(props);
    const ENDPOINT = `${BACKEND_HOST}`;
    this.addNotification = props.addNotification;
    this.setCurrentRoomId = props.setCurrentRoomId;
    this.sessionData = props.sessionData;
    this.state = {
      users: [],
      loadingUsers: true,
    };
    console.log("Admin users view");
    this.handleChange = this.handleChange.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.getNextUsers = this.getNextUsers.bind(this);
    //if (LOCAL) {
    //this.socket = io.connect(ENDPOINT, {path: '/backend'});
    //} else {
    //this.socket = io.connect(ENDPOINT, {path: '/backend', secure: true});
    //}
    //console.log('Connected to socket.io endpoint!');
    this.usrRef = React.createRef();
  }
  singleFileChangedHandler = event => {
    this.setState({
      selectedFile: event.target.files[0],
    });
  };

  // ShowAlert Function
  ocShowAlert = (user, background = '#3089cf') => {
    let alertContainer = document.querySelector('#oc-alert-container'),
      alertEl = document.createElement('div'),
      textNode = document.createTextNode(user);
    alertEl.setAttribute('class', 'oc-alert-pop-up');
    $(alertEl).css('background', background);
    alertEl.appendChild(textNode);
    alertContainer.appendChild(alertEl);
    setTimeout(function() {
      $(alertEl).fadeOut('slow');
      $(alertEl).remove();
    }, 3000);
  };

  componentDidMount() {
    this.loadUsers(25);
    setTimeout(this.scrollToBottom, 50);
  }

  scrollToBottom = () => {
    if (this.usrRef.current !== null) {
      this.usrRef.current.scrollTop = this.usrRef.current.scrollHeight;
      this.forceUpdate();
    }
  };

  handleScroll(e) {
    let element = e.target;
    if (element.scrollTop === 0) {
      // we fetch the next 10 users and add them.
      this.getNextUsers(25);
    }
  }

  getNextUsers(amount) {
    const latest = this.state.users[0];
    //TODO: add auth
    fetch(`${BACKEND_HOST}/admin/users/before/${amount}`, {
      // method is POST!?.
      method: 'POST',
      body: JSON.stringify(latest), // I could add jwt here
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(r => r.json())
      .then(r => {
        const users = r;
        this.state.users.map(user => users.push(user));
        this.setState({users: []});
        this.setState({users: users});
      });
  }

  loadUsers(amount) {
    fetch(`${BACKEND_HOST}/admin/users/latest/${amount}`)
      .then(r => r.json())
      .then(res => {
        this.setState({users: res, loadingUsers: false});
      });
  }

  handleChange(event) {
    this.setState({user: event.target.value});
  }

  render() {
    return (
      <div className="container">
        <div className={'text-center inline-horizontal'}>
          <button
            className="back-button"
            type="button"
            onClick={() => this.setCurrentRoomId(-1)}>
            Back
          </button>
        </div>
        <div className={'messaging'}>
          <div className={'inbox_msg'} onScroll={this.handleScroll}>
            <div className="mesgs">
              <div className="msg_history" ref={this.usrRef}>
                {this.state.loadingUsers ? (
                  <h1>Loading users...</h1>
                ) : (
                  this.state.users.map((user, i) => {
                    return (
                      <UserView
                        userData={{
                          username: user.username,
                          name: user.name,
                          email: user.email,
                          role: user.role,
                        }}
                        key={i}
                      />
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
