import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";

import Login from "./components/sign/login.component";
import Register from "./components/sign/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import BoardUser from "./components/board-user.component";
import BoardAdmin from "./components/board-admin.component";
import Navigation from "./components/shared/navbar.component";
import { Container } from "react-bootstrap";

class App extends Component {
    constructor(props) {
        super(props);
        this.logOut = this.logOut.bind(this);

        this.state = {
          showAdminBoard: false,
          currentUser: undefined,
        };
    }

    componentDidMount() {
        const user = AuthService.getCurrentUser();

        if (user) {
          this.setState({
            currentUser: user,
            showAdminBoard: user.roles.includes("ROLE_ADMIN"),
          });
      }
    }

    logOut() {
        AuthService.logout();
    }

    render() {
        const { currentUser, showAdminBoard } = this.state;

        return (
            <>
              <Navigation />
              <Container className="mt-3">
                  <Switch>
                      <Route exact path={["/", "/home"]} component={Home} />
                      <Route exact path="/login" component={Login} />
                      <Route exact path="/register" component={Register} />
                      <Route exact path="/profile" component={Profile} />
                      <Route path="/user" component={BoardUser} />
                      <Route path="/admin" component={BoardAdmin} />
                  </Switch>
              </Container>
          </>
        );
    }
}

export default App;