import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";

import Login from "./components/sign/login.component";
import Register from "./components/sign/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import ScheduleBoard from "./components/board-schedules.component";
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
        return (
            <>
              <Navigation />
              <Container className="mt-3">
                  <Switch>
                      <Route exact path={["/", "/home"]} component={Home} />
                      <Route exact path="/login" component={Login} />
                      <Route exact path="/register" component={Register} />
                      <Route exact path="/profile" component={Profile} />
                      <Route path="/schedules" component={ScheduleBoard} />
                      <Route path="/admin" component={BoardAdmin} />
                  </Switch>
              </Container>
          </>
        );
    }
}

export default App;