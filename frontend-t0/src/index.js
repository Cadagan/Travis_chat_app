import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter, Route, Switch} from 'react-router-dom';
import * as serviceWorker from "./serviceWorker";
import Login from "./components/register/LoginView";
import SignUp from "./components/register/SignUpView";
import session from "./sessions";

ReactDOM.render(
    <BrowserRouter>
        <Route exact path='/' component={App} />
        <Switch>
            <Route path="/sign-in" render={(props) => <Login {...props} setSessionID={session.setSessionID}/>}/>
            <Route path="/sign-up" component={SignUp} />
        </Switch>
    </BrowserRouter>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
