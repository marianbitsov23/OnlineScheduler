import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/user-auth/auth.service";

import Login from "./components/sign/login.component";
import Register from "./components/sign/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import ScheduleBoard from "./components/board-schedules.component";
import BoardAdmin from "./components/board-admin.component";
import Navigation from "./components/shared/navbar.component";
import { Container } from "react-bootstrap";
import CreateSchedule from "./components/schedule/schedule-create.component";
import CreateCabinet from "./components/schedule/cabinet-create.component";
import CreateSubject from "./components/schedule/subject-create.compnent";
import CreateTeacher from "./components/schedule/teacher-create.component";
import CreateTimeTable from "./components/schedule/timeManegment/time-table-create.component";
import CreateGroup from "./components/schedule/group-create.component";

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
                      <Route exact path = "/create-schedule" component={CreateSchedule} />
                      <Route exact path = "/create-cabinet" component={CreateCabinet} />
                      <Route exact path = "/create-subject" component={CreateSubject} />
                      <Route exact path = "/create-teacher" component={CreateTeacher} />
                      <Route exact path = "/create-time-table" component={CreateTimeTable} />
                      <Route exact path = "/create-group" component={CreateGroup} />
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