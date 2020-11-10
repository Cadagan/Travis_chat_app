import React, {useRef} from 'react';
import MessageView from './MessageView';
import {animateScroll} from 'react-scroll';
import io from 'socket.io-client';
import {BACKEND_HOST, LOCAL} from '../App';
import axios from 'axios';
import $ from 'jquery';
import {onMessageRecieved, onMessageSend, userJoinChatroomEvent} from "./events/chatroomEvents";
import {pgpKey} from "./services/PGPKey";


export default class RoomView extends React.Component {
    constructor(props) {
        super(props);
        const ENDPOINT = `${BACKEND_HOST}`;
        this.addNotification = props.addNotification;
        this.setCurrentRoomId = props.setCurrentRoomId;
        this.roomName = props.roomName;
        this.sessionData = props.sessionData;
        this.state = {message: "", messages: [], loadingMessages: true, selectedFile: null,selectedFiles: null};
        this.handleChange = this.handleChange.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.messageAdded = this.messageAdded.bind(this);
        this.authMessage = this.authMessage.bind(this);
        this.getNextMessages = this.getNextMessages.bind(this);
        this.postMessage = this.postMessage.bind(this);
        if(LOCAL){
            this.socket = io.connect(ENDPOINT, {path: '/backend', query: `roomId=${this.sessionData.roomId}`});
        } else {
            this.socket = io.connect(ENDPOINT, {path: '/backend', query: `roomId=${this.sessionData.roomId}`, secure: true});
        }
        console.log("Connected to socket.io endpoint!");
        this.mesRef = React.createRef();
    }
    singleFileChangedHandler = ( event ) => {
        this.setState({
            selectedFile: event.target.files[0]
        });
    };

    singleFileUploadHandler = ( event ) => {
        const data = new FormData();// If file selected
        if ( this.state.selectedFile ) {
            data.append( 'chatImage', this.state.selectedFile, this.state.selectedFile.name );
            axios.post( `${BACKEND_HOST}/rooms/${this.sessionData.roomId}/chat-img-upload`, data, {
                headers: {
                    'accept': 'application/json',
                    'Accept-Language': 'en-US,en;q=0.8',
                    'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                }
            })
                .then( ( response ) => {if ( 200 === response.status ) {
                    // If file size is larger than expected.
                    if( response.data.error ) {
                        if ( 'LIMIT_FILE_SIZE' === response.data.error.code ) {
                            this.ocShowAlert( 'Max size: 2MB', 'red' );
                        } else {
                            console.log( response.data );// If not the given file type
                            this.ocShowAlert( response.data.error, 'red' );
                        }
                    } else {
                        // Success
                        let fileName = response.data;
                        console.log( `${fileName}, Este es el link a guardar en atributo imagen: ${fileName.location}, `);
                        this.setState({roomImage: fileName.location});
                        this.ocShowAlert( 'File Uploaded', '#3089cf' );
                    }
                }
                }).catch( ( error ) => {
                // If another error
                this.ocShowAlert( error, 'red' );
            });
        } else {
            // if file not selected throw error
            this.ocShowAlert( 'Please upload file', 'red' );
        }};

    // ShowAlert Function
    ocShowAlert = ( message, background = '#3089cf' ) => {
        let alertContainer = document.querySelector( '#oc-alert-container' ),
            alertEl = document.createElement( 'div' ),
            textNode = document.createTextNode( message );
        alertEl.setAttribute( 'class', 'oc-alert-pop-up' );
        $( alertEl ).css( 'background', background );
        alertEl.appendChild( textNode );
        alertContainer.appendChild( alertEl );
        setTimeout( function () {
            $( alertEl ).fadeOut( 'slow' );
            $( alertEl ).remove();
        }, 3000 );
    };

    componentDidMount() {
        this.socket.on("auth-message", this.authMessage);
        this.socket.on("message-added", this.messageAdded);
        if(this.sessionData.roomId>=0){
            userJoinChatroomEvent(this.sessionData.roomId, this.sessionData.username,this.socket, res=>{

            });
        }
        this.loadMessages(25);
        this.getRoomImage();
        setTimeout(this.scrollToBottom, 50);
    }

    authMessage(message){
        console.log("We're exchanging public keys.");
        onMessageRecieved(message, this.socket,sendBack=>{
            console.log("Sending back our key!");
            userJoinChatroomEvent(this.sessionData.roomId, this.sessionData.username, this.socket, res=>{

            });
        });
    }


    scrollToBottom = () => {
        if(this.mesRef.current!==null) {
            this.mesRef.current.scrollTop = this.mesRef.current.scrollHeight;
            this.forceUpdate()
        }
    };

    handleScroll(e) {
        let element = e.target;
        if (element.scrollTop === 0) {
            // we fetch the next 10 messages and add them.
            this.getNextMessages(25);
        }
    }
    loadMessages(amount){
        fetch(`${BACKEND_HOST}/messages/${this.sessionData.roomId}/latest/${amount}`)
            .then( r => r.json())
            .then(res => {
                const unciphered_messages = [];
                res.forEach(message=> {
                    onMessageRecieved(message, this.socket,cipherMessage=>{
                        unciphered_messages.push(cipherMessage);
                    })
                });

                this.setState({messages: unciphered_messages, loadingMessages: false});
            });
    }

    postMessage(event){
        if(event!==undefined){
            event.preventDefault();
        }
        let message = this.state.message;
        if(message==="/happy"){
            message = ":)";
        } else if (message==="/sad") {
            message = ":("
        } else if (message === "/random"){
            let num = Math.random()*100;
            num = ~~num;
            message = "Random Number: "+num;
        }
        const data = {username: this.sessionData.name, roomId: this.sessionData.roomId, message: message, encrypted: false, sender: pgpKey.id()};
        onMessageSend(data, (cipherData, keyData)=>{
            fetch(`${BACKEND_HOST}/messages/new`,
                {
                    method: 'POST', // or 'PUT'
                    body: JSON.stringify(cipherData), // data can be `string` or {object}!
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(res=>console.log("Sent message!"));
            this.setState({message: ""});
        })
    }


    messageAdded(message) {
        console.log("A new message is arriving!", message);
        if(message.roomId === this.sessionData.roomId){
            if(message.message.includes(`@${this.sessionData.name}`)){
                this.addNotification(message.message);
                //We send a ping to the backend saying we got the mention.
            }
            const messages = this.state.messages;

            onMessageRecieved(message, this.socket,cipherMessage=>{
                console.log(cipherMessage);
                messages.push(cipherMessage);
            })
            this.setState({messages: messages});
            this.scrollToBottom();
            setTimeout(()=>this.forceUpdate(),100);
        }
    }
  getNextMessages(amount) {
    const latest = this.state.messages[0];
    fetch(
      `${BACKEND_HOST}/messages/${this.sessionData.roomId}/before/${amount}`,
      {
        method: 'POST',
        body: JSON.stringify(latest),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
      .then(r => r.json())
      .then(r => {
        const messages = r;
        this.state.messages.map(message => messages.push(message));
        this.setState({messages: []});
        this.setState({messages: messages});
      });
  }


  handleChange(event) {
    this.setState({message: event.target.value});
  }

    getRoomImage(){
        fetch(`${BACKEND_HOST}/rooms/${this.sessionData.roomId}/image`)
            .then(res => res.json())
            .then(data =>{
               this.setState({roomImage: data.roomImage});
            });
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
          <h3 className="text-center">Sala: {this.roomName}</h3>
        </div>
        <div>
          <img src={this.state.roomImage} alt={'Logo'} />
        </div>
        <div className="card-body">
          <div id="oc-alert-container"></div>
          <p className="card-text">Please upload an image for this chat</p>
          <input type="file" onChange={this.singleFileChangedHandler} />
          <div className="mt-5">
            <button
              className="btn btn-info"
              onClick={this.singleFileUploadHandler}>
              Upload!
            </button>
          </div>
        </div>
        <div className={'messaging'}>
          <div className={'inbox_msg'} onScroll={this.handleScroll}>
            <div className="mesgs">
              <div className="msg_history" ref={this.mesRef}>
                {this.state.loadingMessages ? (
                  <h1>Loading messages...</h1>
                ) : (
                  this.state.messages.map((message, i) => {
                    return (
                      <MessageView
                        messageData={{
                          message: message.message,
                          time: message.time,
                          date: message.date,
                          username: message.username,
                          censured: message.censured,
                          id: message.id,
                        }}
                        key={i}
                      />
                    );
                  })
                )}
              </div>
            </div>
          </div>
          <div className="type_msg">
            <div className="input_msg_write">
              <form onSubmit={this.postMessage}>
                <input
                  type="text"
                  className="write_msg"
                  value={this.state.message}
                  onChange={this.handleChange}
                  placeholder="Type a message"
                />
                <button
                  className="msg_send_btn"
                  type="button"
                  onClick={() => this.postMessage()}>
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
