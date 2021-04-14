import React, { Component } from "react";
import AuthService from "../services/user-auth/auth.service";
import scheduleService from "../services/schedule/schedule.service";
import { Button, Grid } from "@material-ui/core";
import { TextInput } from "./shared/text-input.component";
import { DeleteButton } from "./shared/custom-buttons/delete-button.component";
import { SaveButton } from "./shared/custom-buttons/save-button.component";
import { EditButton } from "./shared/custom-buttons/edit-button.component";
import { CustomAlert } from "./shared/custom-alert.component";

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
            schedules: [],
            alertText: ""
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
            this.setState({ 
                edit: true, 
                alertText: "Промените бяха запазени!", 
                open: true 
            });
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
                alertText: "Паролата беше променена!",
                newPassword: "",
                confirmPassword: "" });
        })
        .catch(() => this.setState({ fail: true, oldPassword: "" }));
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
            alertText,
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
                    <CustomAlert
                        open={open}
                        onClose={this.handleClose}
                        alertText={alertText}
                        variant="success"
                    />
                    <CustomAlert
                        open={fail}
                        onClose={this.handleFail}
                        alertText="Грешна текуща парола"
                        variant="error"
                    />
                    <main className="profile-card">
                        <Grid 
                            container 
                            alignItems="center"
                            direction="column"
                            spacing={3}
                        >
                            <Grid item xs={12}>
                                <div className="profile-image">
                                    <img src="https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png"
                                    alt="Default profie user">
                                    </img>
                                </div>
                            </Grid>
                            <Grid item xs={12}>
                                <div className="button-group">
                                    <DeleteButton
                                        text="Изтриване на профила "
                                        onClick={this.deleteProfile}
                                    />
                                    {edit && <EditButton
                                        text="Редактиране на профила"
                                        className="edit"
                                        onClick={() => this.setState({ edit: false })}
                                    />}
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