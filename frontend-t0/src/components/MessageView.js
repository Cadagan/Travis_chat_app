import React from 'react';
export default class MessageView extends React.Component{
    constructor(props) {
        super(props);
        this.message = props.messageData.message;
        this.date = props.messageData.date;
        this.time = props.messageData.time;
        this.username = props.messageData.username;
    }
    render() {
            return (<div className="incoming_msg">
                        <div className="received_msg">
                            <div className="received_withd_msg">
                                <p>{this.message}</p>
                                <span className="time_date"> {this.username}    -    {this.time}    |    {this.date}</span>
                            </div>
                        </div>
                    </div>
            );
    }
}
