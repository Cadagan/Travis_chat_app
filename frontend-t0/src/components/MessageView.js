import React from 'react';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
export default class MessageView extends React.Component {
  constructor(props) {
    super(props);
    this.message = props.messageData.message;
    this.date = props.messageData.date;
    this.time = props.messageData.time;
    this.username = props.messageData.username;
    this.role = cookies.get('role');
  }
  render() {
    return (
      <div className="incoming_msg">
        <div className="received_msg">
          <div className="received_withd_msg">
            <p>{this.message}</p>
            <span className="time_date">
              {' '}
              {this.username} - {this.time} | {this.date}
            </span>
            {this.role == 'admin' ? (
              <button
                type={'submit'}
                onClick={() => console.log('Clicked censure button')}>
                Censurar
              </button>
            ) : (
              <div></div>
            )}
            {this.role == 'admin' ? (
              <button
                type={'submit'}
                onClick={() => console.log('Clicked modify button')}>
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
