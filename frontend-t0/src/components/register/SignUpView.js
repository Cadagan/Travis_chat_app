import React, { Component } from "react";
import {AUTH_HOST} from "../../App";

export default class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {name: "", username: "", email: "", password:""};
        this.onChange = this.onChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e){
        e.preventDefault();
        const data = {  name: this.state.name,
                        username: this.state.username,
                        email: this.state.email,
                        password: this.state.password};

        fetch(`${AUTH_HOST}/users/signup`,
            {
                method: 'POST', // or 'PUT'
                body: JSON.stringify(data), // data can be `string` or {object}!
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                if(res.status===200) {
                    this.props.history.push('/sign-in')
                }
                //Should we login the users here. Probably just redirect somewhere.
        });
    }

    onChange(e) {
        if (e.target.id === 'name') {
            this.setState({ name: e.target.value });
        } else if (e.target.id === 'username') {
            this.setState({ username: e.target.value });
        } else if (e.target.id === 'email') {
            this.setState({ email: e.target.value });
        } else if (e.target.id === 'password') {
            this.setState({ password: e.target.value});
        }
    }

    render() {
        return (

            <div className={"background"}>
                <div className="auth-wrapper">
                    <div className="auth-inner">
                        <form onSubmit={this.handleSubmit}>
                            <h3>Sign Up</h3>

                            <div className="form-group">
                                <label>Name</label>
                                <input type="text" id={"name"} onChange={this.onChange} className="form-control" placeholder="Name" />
                            </div>

                            <div className="form-group">
                                <label>Username</label>
                                <input type="text" id={"username"} onChange={this.onChange} className="form-control" placeholder="Username" />
                            </div>

                            <div className="form-group">
                                <label>Email address</label>
                                <input type="email" id={"email"} onChange={this.onChange} className="form-control" placeholder="Enter email" />
                            </div>

                            <div className="form-group">
                                <label>Password</label>
                                <input type="password" id={"password"} onChange={this.onChange} className="form-control" placeholder="Enter password" />
                            </div>

                            <button type="submit" className="btn btn-primary btn-block">Sign Up</button>
                            <p className="forgot-password text-right">
                                Already registered <a href="/sign-in">sign in?</a>
                            </p>
                        </form>
                </div>
                </div>
            </div>
        );
    }
}
