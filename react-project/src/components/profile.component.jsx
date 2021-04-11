import React, { Component } from "react";
import AuthService from "../services/user-auth/auth.service";
import scheduleService from "../services/schedule/schedule.service";
import { Button, Grid, Snackbar } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import { TextInput } from "./shared/text-input.component";
import { DeleteButton } from "./shared/custom-buttons/delete-button.component";
import { SaveButton } from "./shared/custom-buttons/save-button.component";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default class Profile extends Component {
    constructor(props) {
        super(props);

        this.saveInformation = this.saveInformation.bind(this);
        this.deleteProfile = this.deleteProfile.bind(this);

        this.state = {
            currentUser: AuthService.getCurrentUser(),
            username: AuthService.getCurrentUser().username,
            email: AuthService.getCurrentUser().email,
            edit: true,
            open: false,
            fail: false,
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
            editPassword: true,
            schedules: []
        };
    }

    componentDidMount() {
        scheduleService.getSchedulesByCreatorId(this.state.currentUser.id)
        .then(result => this.setState({ schedules: result.data }))
        .catch(error => console.error(error));
    }

    onChange = event => this.setState({ [event.target.name] : event.target.value });

    deleteProfile = event => {
        event.preventDefault();

        AuthService.deleteUser(this.state.currentUser.id)
        .then(AuthService.logout())
        .then(() => {
            this.props.history.push("/login");
            window.location.reload();
        });
    }

    saveInformation = event => {
        event.preventDefault();

        const newUser = {
            id: this.state.currentUser.id,
            username: this.state.username, 
            email: this.state.email,
            password: this.state.currentUser.password,
            accessToken: this.state.currentUser.accessToken,
            tokenType: this.state.currentUser.tokenType
        }

        AuthService.udpateUserInformation(newUser)
        .then(() => {
            newUser.roles = this.state.currentUser.roles;
            newUser.schedules = this.state.currentUser.schedules;
            localStorage.setItem("user", JSON.stringify(newUser));
        })
        .then(() => {
            this.setState({ edit: true });
        })
        .catch(error => console.error(error));
    }

    savePassword = () => {
        const { username, oldPassword, newPassword } = this.state;

        AuthService.changePassword(username, oldPassword, newPassword)
        .then(result => {
            console.log(result.data);
            this.setState({ 
                editPassword: true, 
                open: true,
                oldPassword: "",
                newPassword: "",
                confirmPassword: "" });
        })
        .catch(error => this.setState({ fail: true, oldPassword: "" }));
    }

    handleClose = () => this.setState({ open: false });
    handleFail = () => this.setState({ fail: false });

    render() {
        const { 
            username, 
            email,
            open,
            fail,
            edit,
            editPassword,
            oldPassword, 
            newPassword, 
            confirmPassword } = this.state;

        const isInvalid = newPassword !== confirmPassword
            || newPassword === "" 
            || confirmPassword === ""
            || oldPassword === "";

        return (
                <>
                    <Snackbar open={open} autoHideDuration={6000} onClose={this.handleClose}>
                        <Alert onClose={this.handleClose} severity="success">
                            Паролата е променена!
                        </Alert>
                    </Snackbar>
                    <Snackbar open={fail} autoHideDuration={6000} onClose={this.handleFail}>
                        <Alert onClose={this.handleFail} severity="error">
                            Грешна текуща парола!
                        </Alert>
                    </Snackbar>
                    <main className="profile-card">
                        <Grid 
                            container 
                            alignItems="center"
                            direction="column" 
                            spacing={3}
                        >
                            <Grid item xs={12}>
                                <div className="profile-image">
                                    <img src="https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png">
                                    </img>
                                </div>
                            </Grid>
                            <Grid item xs={12}>
                                <div className="button-group">
                                    <DeleteButton
                                        text="Изтриване на профила "
                                        onClick={this.deleteProfile}
                                    />
                                    {edit && <Button
                                        variant="contained"
                                        className="edit"
                                        onClick={() => this.setState({ edit: false })}
                                    >
                                        Редактиране на профила
                                    </Button>}
                                    {!edit && 
                                    <SaveButton
                                        onClick={this.saveInformation}
                                        text="Запазване на промените"
                                    />}
                                    <Button
                                        variant="contained"
                                        className="edit"
                                        onClick={() => this.setState({ editPassword: !editPassword })}
                                    >
                                        Промяна на паролата
                                    </Button>
                                </div>
                            </Grid>
                            <Grid 
                                container 
                                alignItems="stretch"
                                direction="column" 
                                item xs={6}
                            >
                                <Grid item xs={12}>
                                    <TextInput
                                        name="username"
                                        label="Потребителско име"
                                        value={username}
                                        onChange={this.onChange}
                                        readOnly={edit}
                                        variant={edit ? "outlined" : "filled"}
                                        helperText={edit ? "" : "Промяна на потребителското име"}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextInput
                                        name="email"
                                        label="Електронна поща"
                                        value={email}
                                        onChange={this.onChange}
                                        readOnly={edit}
                                        variant={edit ? "outlined" : "filled"}
                                        helperText={edit ? "" : "Промяна на електронната поща"}
                                    />
                                </Grid>
                            </Grid>
                            {!editPassword && <Grid 
                                container 
                                alignItems="stretch"
                                direction="column" 
                                justify="center"
                                item xs={6}
                            >
                                <Grid item xs={12}>
                                    <TextInput
                                        name="oldPassword"
                                        type="password"
                                        label="Въведете текущата парола"
                                        value={oldPassword}
                                        onChange={this.onChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextInput
                                        name="newPassword"
                                        type="password"
                                        label="Въведете новата парола"
                                        value={newPassword}
                                        onChange={this.onChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextInput
                                        name="confirmPassword"
                                        type="password"
                                        label="Потвърдете новата парола"
                                        value={confirmPassword}
                                        onChange={this.onChange}
                                    />
                                </Grid>
                                <div className="save-password">
                                    <SaveButton
                                        text="Запазване на паролата "
                                        disabled={isInvalid}
                                        onClick={this.savePassword}
                                    />
                                </div>
                            </Grid>}
                        </Grid>
                    </main>
                </>
            );
    }
}