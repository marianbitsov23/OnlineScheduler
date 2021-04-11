import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import "../src/scss/main/common.scss";
import 'semantic-ui-css/semantic.min.css'
import '../src/scss/main/color-palette.scss';
import '../src/scss/main/footer.scss';
import '../src/scss/main/navbar.scss';
import '../src/scss/schedule/dashboard/dashboard.scss';
import '../src/scss/schedule/document/document.scss';
import '../src/scss/shared/dialog/dialog.scss';
import '../src/scss/shared/category-select/category-select.scss';
import '../src/scss/schedule/time-table/time-table.scss';
import '../src/scss/user-profile/user-profile.scss';
import '../src/scss/shared/delete-button/delete-button.scss';
import '../src/scss/shared/save-button/save-button.scss';
import "./App.css";
import AuthService from "./services/user-auth/auth.service";
import Login from "./components/sign/login.component";
import Register from "./components/sign/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import ScheduleBoard from "./components/board-schedules.component";
import BoardAdmin from "./components/board-admin.component";
import Navigation from "./components/shared/navbar.component";
import ForgotPassword from "./components/sign/forgot-password.component";
import ResetPassword from "./components/sign/reset-password.component";
import ManageSchedules from "./components/schedule/schedule-management.component";
import ManageCabinets from "./components/schedule/cabinet-management.component";
import ManageSubjects from "./components/schedule/subject-management.compnent";
import ManageTeachers from "./components/schedule/teacher-management.component";
import ManageTimeTables from "./components/schedule/time-management/time-table-management.component";
import ManageTeachingHours from "./components/schedule/teaching-hour-management.component";
import ManageGroups from "./components/schedule/group-management.component";
import Footer from "./components/shared/footer.component";
import ScheduleDashboard from "./components/schedule/dashboard/schedule-dashboard.component";
import { MuiThemeProvider } from "@material-ui/core";
import { OnlineSchedulerTheme } from "./theme/theme";

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
            <div className="
            myDisplayFlexColumn 
            footerMinHeight 
            backgroundColor
            clickBorder
            myFontFamily"
            >
              <MuiThemeProvider theme={OnlineSchedulerTheme}>
                <Navigation />
                    <Switch>
                        <Route exact path={["/", "/home"]} component={Home} />
                        <Route exact path="/forgot-password" component={ForgotPassword} />
                        <Route exact path="/reset-password" component={ResetPassword} />
                        <Route exact path="/login" component={Login} />
                        <Route exact path = "/schedule-management" component={ManageSchedules} />
                        <Route exact path = "/cabinet-management" component={ManageCabinets} />
                        <Route exact path = "/subject-management" component={ManageSubjects} />
                        <Route exact path = "/teacher-management" component={ManageTeachers} />
                        <Route exact path = "/time-table-management" component={ManageTimeTables} />
                        <Route exact path = "/teaching-hour-management" component={ManageTeachingHours} />
                        <Route exact path = "/schedule-dashboard" component={ScheduleDashboard} />
                        <Route exact path = "/group-management" component={ManageGroups} />
                        <Route exact path="/register" component={Register} />
                        <Route exact path="/profile" component={Profile} />
                        <Route path="/schedules" component={ScheduleBoard} />
                        <Route path="/admin" component={BoardAdmin} />
                    </Switch>
                <Footer />
              </MuiThemeProvider>
          </div>
        );
    }
}

export default App;