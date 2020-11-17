import React, {Component} from 'react';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import {AUTH_HOST} from '../../App';
import Cookies from 'universal-cookie';
import axios from 'axios';
import GoogleLogin from "react-google-login";
import config from "../../config";
const cookies = new Cookies();


export default class Login extends Component {
    constructor(props) {
        super(props);
        this.setSessionID = props.setSessionID;
        this.state = {username: "", password: "", remember: false, authResult: false};
        this.onChange = this.onChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onGoogle = this.onGoogle.bind(this);
    }

    responseGoogle(response){
        const tokenBlob = new Blob([JSON.stringify({access_token: response.accessToken}, null, 2)], {type : 'application/json'});
        const options = {
            method: 'POST',
            body: tokenBlob,
            mode: 'cors',
            cache: 'default'
        };
        fetch('http://localhost:3002/users/auth/google', options).then(r => {
            const token = r.headers.get('x-auth-token');
            r.json().then(user => {
                if (token) {
                    this.setState({isAuthenticated: true, user, token})
                }
            });
        })
    }

    async componentDidMount() {
        axios.get(`${AUTH_HOST}/users/login/success`, {
            headers: {
                'accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.8',
                'Content-Type': 'application/json',
                // 'mode': 'no-cors'
            }
        }).then(res => {
            if (res.status === 200) {
                console.log("Responde did Mount");
                console.log(res);
            }
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        const data = {username: this.state.username, password: this.state.password};

        fetch(`${AUTH_HOST}/users/signin`, {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(data), // data can be `string` or {object}!
            //credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log('Logging in!');
                //this.setSessionID(data);
                cookies.set('sessionID', data.sessionID);
                cookies.set('token', data.token);
                cookies.set('username', data.username);
                cookies.set('role', data.role);
                //setUsername(data.username);
                this.props.history.push('/');
            });
    }

    onChange(e) {
        if (e.target.id === 'username') {
            this.setState({username: e.target.value});
        } else if (e.target.id === 'password') {
            this.setState({password: e.target.value});
        } else if (e.target.id === 'remember') {
            this.setState({remember: e.target.value});
        }
    }



    onGoogle() {
        window.open(`${AUTH_HOST}/users/oathsignup`, '_self');
        console.log("You clicked google");

        window.location = `${AUTH_HOST}/users/auth/google`;
        this.setState({
            authResult: true
        });
    }

    render() {
        return (
            <div className={'background'}>
                <div className="auth-wrapper">
                    <div className="auth-inner">
                        <form onSubmit={this.handleSubmit}>
                            <h3>Sign In</h3>

                            <div className="form-group">
                                <label>Username</label>
                                <input
                                    type="text"
                                    id={'username'}
                                    onChange={this.onChange}
                                    className="form-control"
                                    placeholder="Enter username"
                                />
                            </div>

                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    id={'password'}
                                    onChange={this.onChange}
                                    className="form-control"
                                    placeholder="Enter password"
                                />
                            </div>

                            <div className="form-group">
                                <div className="custom-control custom-checkbox">
                                    <input
                                        type="checkbox"
                                        id={'remember'}
                                        onChange={this.onChange}
                                        className="custom-control-input"
                                    />
                                    <label
                                        className="custom-control-label"
                                        htmlFor="customCheck1">
                                        Remember me
                                    </label>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary btn-block">
                                Submit
                            </button>
                            <p className="forgot-password text-right">
                                Forgot <a href="#">password?</a>
                            </p>
                        </form>
                        <div className={'google-btn'}>
                            <GoogleLogin
                                clientId={config.GOOGLE_CLIENT_ID}
                                buttonText="Login with Google"
                                onSuccess={this.responseGoogle}
                                onFailure={this.responseGoogle}
                                cookiePolicy={'single_host_origin'}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}