import React from 'react';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
export default class MessageView extends React.Component {
  constructor(props) {
    super(props);
    this.username = props.userData.username;
    this.name = props.userData.name;
    this.email = props.userData.email;
    this.role = cookies.get('role');
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
            </span>
          </div>
        </div>
      </div>
    );
  }
}
