import React, {Component} from 'react';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import {AUTH_HOST} from '../../App';
import Cookies from 'universal-cookie';
import axios from 'axios';
import GoogleLogin from "react-google-login";
import config from "../../config";
import { withAuth0 } from "@auth0/auth0-react";
const cookies = new Cookies();


class Login extends Component {
    constructor(props) {
        super(props);
        this.setSessionID = props.setSessionID;
        this.state = {username: "", password: "", remember: false, authResult: false};
        this.onChange = this.onChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.responseGoogle = this.responseGoogle.bind(this);

        const { loginWithRedirect } = this.props.auth0;
        this.loginWithRedirect = loginWithRedirect;
    }

    responseGoogle(response) {
        const tokenBlob = new Blob([JSON.stringify({access_token: response.accessToken}, null, 2)], {type: 'application/json'});
        const options = {
            method: 'POST',
            body: tokenBlob,
            mode: 'cors',
            cache: 'default'
        };
        console.log('Click google');
        axios.post(`${AUTH_HOST}/users/auth/google`, {
            data: tokenBlob, 
            headers: {
                'accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.8',
                'Content-Type': 'application/json',
                'mode': 'cors',
                'cache': 'default'
            },
            withCredentials: true,
            }).then(res => {
                console.log(res);
                const token = res.headers.get('x-auth-token');
                res.json().then(user => {
                if (token) {
                    // this.setState({isAuthenticated: true, user, token})
                    console.log(user);
                    console.log(token);
                }
            });
        });
    }

    async componentDidMount() {
        const {user} = this.props.auth0;
        console.log(user);
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
                        <div className={'google-btn'}>
                            <button onClick={() => this.loginWithRedirect()}>Log In</button>;
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default withAuth0(Login);