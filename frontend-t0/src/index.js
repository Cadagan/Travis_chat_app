import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import Login from './components/register/LoginView';
import SignUp from './components/register/SignUpView';
import session from './sessions';
import {Auth0Provider} from '@auth0/auth0-react';
import config from './config';
import {LOCAL} from './App';
import MonitorComponent from "./components/MonitorComponent";

ReactDOM.render(
  <BrowserRouter>
    <Auth0Provider
      domain={config.AUTH0_DOMAIN}
      clientId={config.AUTH0_CLIENT_ID}
      redirectUri={LOCAL ? 'http://localhost:3000' : "https://www.grupo21frontend.ml"}
      audience={LOCAL ? 'http://localhost:3001' : config.AUTH0_AUDIENCE}
      scope={
        'read:username create:image read:image interact:room read:room create:room read:message ' +
        'create:message read:user update:message update:room delete:room update:user'
      }>
      <Route exact path="/" component={App} />
      <Switch>
        <Route
          path="/sign-in"
          render={props => (
            <Login {...props} setSessionID={session.setSessionID} />
          )}
        />
        <Route path="/sign-up" component={SignUp} />
        <Route path={"/monitor"} component={MonitorComponent}/>
      </Switch>
    </Auth0Provider>
    ,
  </BrowserRouter>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
serviceWorker.unregister();

