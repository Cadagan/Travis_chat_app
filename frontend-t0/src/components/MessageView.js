import React from 'react';
import {BACKEND_HOST, LOCAL} from '../App';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
export default class MessageView extends React.Component {
  constructor(props) {
    super(props);
    this.id = props.messageData.id;
    this.message = props.messageData.message;
    this.date = props.messageData.date;
    this.time = props.messageData.time;
    this.username = props.messageData.username;
    this.censured = props.messageData.censured;
    console.log(`Message censured: ${this.censured}`);
    this.role = cookies.get('role');
    this.editMessage = this.editMessage.bind(this);
    this.censureMessage = this.censureMessage.bind(this);
  }
  editMessage(event) {
    if (event !== undefined) {
      event.preventDefault();
    }
    let input = prompt('Nuevo mensaje', '666');
    console.log(`edit message input: ${input}`);
    if (input !== '666') {
      console.log(`id: ${this.id}, message: ${input}`);
      const data = {id: this.id, message: input};
      fetch(`${BACKEND_HOST}/admin/editMessage`, {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(data), // data can be `string` or {object}!
        headers: {
          'Content-Type': 'application/json',
        },
      });
      window.location.reload();
    }
  }

  censureMessage(event) {
    if (event !== undefined) {
      event.preventDefault();
    }
    console.log(`censureMessage input: ${this.id}`);
    console.log(`id: ${this.id}`);
    const data = {id: this.id};
    fetch(`${BACKEND_HOST}/admin/censureMessage`, {
      method: 'POST', // or 'PUT'
      body: JSON.stringify(data), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json',
      },
    });
    window.location.reload();
  }

  render() {
    return (
      <div className="incoming_msg">
        <div className="received_msg">
          <div className="received_withd_msg">
            {this.censured? (
              <p>Este mensaje está censurado.</p>
            ) : (
              <p>{this.message}</p>
            )}
            <span className="time_date">
              {' '}
              {this.username} - {this.time} | {this.date}
            </span>
            {this.role == 'admin' ? (
              <button type={'submit'} onClick={this.censureMessage}>
                Censurar
              </button>
            ) : (
              <div></div>
            )}
            {this.role == 'admin' ? (
              <button type={'submit'} onClick={this.editMessage}>
                Modificar
              </button>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
