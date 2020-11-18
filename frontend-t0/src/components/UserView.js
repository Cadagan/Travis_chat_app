import React from 'react';
import Cookies from 'universal-cookie';
import {BACKEND_HOST, LOCAL} from '../App';
import axios from "axios";
const cookies = new Cookies();
const {withAuth0} = require("@auth0/auth0-react");

class UserView extends React.Component {
  constructor(props) {
    super(props);
    this.id = props.userData.id;
    this.username = props.userData.username;
    this.name = props.userData.name;
    this.email = props.userData.email;
    this.role = props.userData.role;
    this.obtainAccessToken = props.obtainAccessToken;
    this.editUsername = this.editUsername.bind(this);
    this.editName = this.editName.bind(this);
    this.editEmail = this.editEmail.bind(this);
    this.editRole = this.editRole.bind(this);
    this.editGoogleid = this.editGoogleid.bind(this);
  }
  editUsername(event) {
    if (event!==undefined){
      event.preventDefault();
    }
    let input = prompt('Nuevo valor de Username', '666');
    console.log(`editUsername input: ${input}`);
    if (input !== '666') {
      console.log(`id: ${this.id}, username: ${this.username}`)
      const data = {id: this.id, username: input};
      this.obtainAccessToken(`http://localhost:3001`,'update:user').then(accessToken=>{
        axios.post(`${BACKEND_HOST}/admin/editUsername`, data,{
          headers: {
            'accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.8',
            'Content-Type': 'application/json',
            'mode': 'cors',
            'cache': 'default',
            'Authorization': `Bearer ${accessToken}`
          },
          withCredentials: true,
        })
      });
      window.location.reload();
    }
  }
  editName(event) {
    if (event!==undefined){
      event.preventDefault();
    }
    let input = prompt('Nuevo valor de name', '666');
    console.log(`editName input: ${input}`);
    if (input !== '666') {
      const data = {id: this.id, name: input};

      this.obtainAccessToken(`http://localhost:3001`,'update:user').then(accessToken=>{
        axios.post(`${BACKEND_HOST}/admin/editName`, data,{
          headers: {
            'accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.8',
            'Content-Type': 'application/json',
            'mode': 'cors',
            'cache': 'default',
            'Authorization': `Bearer ${accessToken}`
          },
          withCredentials: true,
        })
      });
      window.location.reload();
    }
  }
  editEmail(event) {
    if (event!==undefined){
      event.preventDefault();
    }
    let input = prompt('Nuevo valor de email', '666');
    console.log(`editEmail input: ${input}`);
    if (input !== '666') {
      const data = {id: this.id, email: input};
      this.obtainAccessToken(`http://localhost:3001`,'update:user').then(accessToken=>{
        axios.post(`${BACKEND_HOST}/admin/editEmail`,data, {
          headers: {
            'accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.8',
            'Content-Type': 'application/json',
            'mode': 'cors',
            'cache': 'default',
            'Authorization': `Bearer ${accessToken}`
          },
          withCredentials: true,
        })
      });
      window.location.reload();
    }
  }
  editRole(event) {
    if (event!==undefined){
      event.preventDefault();
    }
    let input = prompt('Nuevo valor de role', '666');
    console.log(`editRole input: ${input}`);
    if (input !== '666') {
      const data = {id: this.id, role: input};
      this.obtainAccessToken(`http://localhost:3001`,'update:user').then(accessToken=>{
        axios.post(`${BACKEND_HOST}/admin/editRole`, data,{
          headers: {
            'accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.8',
            'Content-Type': 'application/json',
            'mode': 'cors',
            'cache': 'default',
            'Authorization': `Bearer ${accessToken}`
          },
          withCredentials: true,
        })
      });
      window.location.reload();
    }
  }
  editGoogleid(event) {
    if (event!==undefined){
      event.preventDefault();
    }
    let input = prompt('Nuevo valor de googleid', '666');
    console.log(`editGoogleid input: ${input}`);
    if (input !== '666') {
      const data = {id: this.id, googleid: input};
      this.obtainAccessToken(`http://localhost:3001`,'update:user').then(accessToken=>{
        axios.post(`${BACKEND_HOST}/admin/editGoogleid`, data,{
          headers: {
            'accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.8',
            'Content-Type': 'application/json',
            'mode': 'cors',
            'cache': 'default',
            'Authorization': `Bearer ${accessToken}`
          },
          withCredentials: true,
        })
      });
      window.location.reload();
    }
  }
  render() {
    return (
      <div className="incoming_msg">
        <div className="received_msg">
          <div className="received_withd_msg">
            <p>{this.username}</p>
            <span className="time_date">
              {' '}
              {this.name} - {this.email} | {this.role}
              <button type={'submit'} onClick={() => this.editUsername()}>
                Editar username
              </button>
              <button type={'submit'} onClick={() => this.editName()}>
                Editar name
              </button>
              <button type={'submit'} onClick={() => this.editEmail()}>
                Editar email
              </button>
              <button type={'submit'} onClick={() => this.editRole()}>
                Editar role
              </button>
              <button type={'submit'} onClick={() => this.editGoogleid()}>
                Editar googleid
              </button>
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default withAuth0(UserView);