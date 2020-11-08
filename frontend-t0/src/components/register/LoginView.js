import React, { Component } from "react";
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import {BACKEND_HOST} from "../../App";
import {setUsername} from "../../sessions";
import {Switch} from "react-router-dom";

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.setSessionID = props.setSessionID;
        this.state = {username: "", password:"", remember: false};
        this.onChange = this.onChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e){
        e.preventDefault();
        const data = {username: this.state.username,
            password: this.state.password};

        fetch(`${BACKEND_HOST}/users/signin`,
            {
                method: 'POST', // or 'PUT'
                body: JSON.stringify(data), // data can be `string` or {object}!
                //credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => response.json())
            .then(data => {
                console.log("Logging in!");
                this.setSessionID(data.sessionID);
                setUsername(data.username);
                this.props.history.push('/')

            });
    }

    onChange(e) {
        if (e.target.id === 'username') {
            this.setState({ username: e.target.value });
        } else if (e.target.id === 'password') {
            this.setState({ password: e.target.value});
        } else if(e.target.id === 'remember'){
            this.setState({remember: e.target.value});
        }
    }

    render() {
        return (
            <div className={"background"}>
                <div className="auth-wrapper">
                    <div className="auth-inner">
                        <form onSubmit={this.handleSubmit}>
                            <h3>Sign In</h3>

                            <div className="form-group">
                                <label>Username</label>
                                <input type="text" id={"username"} onChange={this.onChange} className="form-control" placeholder="Enter username" />
                            </div>

                            <div className="form-group">
                                <label>Password</label>
                                <input type="password"  id={"password"} onChange={this.onChange} className="form-control" placeholder="Enter password" />
                            </div>

                            <div className="form-group">
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" id={"remember"} onChange={this.onChange} className="custom-control-input"/>
                                    <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary btn-block">Submit</button>
                            <p className="forgot-password text-right">
                                Forgot <a href="#">password?</a>
                            </p>
                        </form>

                        <div className={"google-btn"}>
                            <div className ={"google-icon-wrapper"}>
                                <img className = "google-icon-svg" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"/>
                            </div>
                            <p className="btn-text"><b>Sign in with Google</b></p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
