import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../src/scss/common.scss";
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
import ForgotPassword from "./components/sign/forgot-password.component";
import ResetPassword from "./components/sign/reset-password.component";
import ManageSchedules from "./components/schedule/schedule-management.component";
import ManageCabinets from "./components/schedule/cabinet-management.component";
import ManageSubjects from "./components/schedule/subject-management.compnent";
import ManageTeachers from "./components/schedule/teacher-management.component";
import ManageTimeTables from "./components/schedule/timeManegment/time-table-management.component";
import ManageTeachingHours from "./components/schedule/teaching-hour-management.component";
import ManageGroups from "./components/schedule/group-management.component";
import Footer from "./components/shared/footer.component";

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
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh'
            }}>
              <Navigation />
              <Container className="mt-3">
                  <Switch>
                      <Route exact path={["/", "/home"]} component={Home} />
                      <Route exact path="/forgot-password" component={ForgotPassword} />
                      <Route exact path="/reset_password" component={ResetPassword} />
                      <Route exact path="/login" component={Login} />
                      <Route exact path = "/schedule-management" component={ManageSchedules} />
                      <Route exact path = "/cabinet-management" component={ManageCabinets} />
                      <Route exact path = "/subject-management" component={ManageSubjects} />
                      <Route exact path = "/teacher-management" component={ManageTeachers} />
                      <Route exact path = "/time-table-management" component={ManageTimeTables} />
                      <Route exact path = "/teaching-hour-management" component={ManageTeachingHours} />
                      <Route exact path = "/group-management" component={ManageGroups} />
                      <Route exact path="/register" component={Register} />
                      <Route exact path="/profile" component={Profile} />
                      <Route path="/schedules" component={ScheduleBoard} />
                      <Route path="/admin" component={BoardAdmin} />
                  </Switch>
              </Container>
              <Footer />
          </div>
        );
    }
}

export default App;