import React, { Component } from 'react';
import authService from "../../services/user-auth/auth.service";
import { FormGroup, Alert } from 'react-bootstrap';
import { isEmail } from "validator";
import Form from "react-validation/build/form";
import { Avatar, CssBaseline, Container, 
    Typography, TextField, Button, Grid } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Link } from 'react-router-dom';

export  default class Register extends Component {
    constructor(props) {
        super(props);
        this.handleRegister = this.handleRegister.bind(this);
        this.onChange = this.onChange.bind(this);

        this.state = {
            username: "",
            password: "",
            email: "",
            message: "",
            loading: false,
            isInvalidUsername: false,
            isInvalidEmail: false,
            isInvalidPassword: false
        };
    }

    onChange = event => {
        switch([event.target.name][0]) {
            case 'username':
                this.setState({ 
                    isInvalidUsername: 
                        event.target.value.length < 3 ||
                        event.target.value.length > 20
                });
                break;
            case 'password':
                this.setState({ 
                    isInvalidPassword: 
                        event.target.value.length < 6 ||
                        event.target.value.length > 40
                });
                break;
            case 'email':
                this.setState({
                    isInvalidEmail: 
                        !isEmail(event.target.value)
                });
                break;
            default:
                break;
        }
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleRegister = event => {
        event.preventDefault();

        const { username, password, email } = this.state;

        this.setState({
            message: "",
            loading: false
        });

        authService.register(username, email, password)
        .then(() => {
            authService.login(this.state.username, this.state.password)
            .then(() => {
                this.props.history.push("/profile");
                window.location.reload();
            });
        })
        .catch(error => {
            const response = 
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                        error.message ||
                        error.toString()
            this.setState({ message: response, loading: false})
        });

    }

    render() {

        const{ username, email, password, 
            isInvalidUsername, isInvalidEmail, isInvalidPassword } = this.state;
        
            const disabled =
                isInvalidUsername ||
                isInvalidEmail ||
                isInvalidPassword;
        return (
            <>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <div className="myDisplayFlexColumn 
                    alignItemsCenter
                    myDefaultMargin">
                        <Avatar className="myDefaultMargin primaryBackground">
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Create account
                        </Typography>
                        <Form onSubmit={this.handleRegister}>
                            <TextField
                                error={isInvalidUsername}
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                label="Username"
                                name="username"
                                value={username}
                                onChange={this.onChange}
                                autoComplete="username"
                                helperText='The username must be between 3 and 20 characters!'
                            />
                            <TextField
                                error={isInvalidEmail}
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                label="Email Address"
                                name="email"
                                value={email}
                                onChange={this.onChange}
                                autoComplete="email"
                                helperText='Enter a valid email example@emp.com'
                            />
                            <TextField
                                error={isInvalidPassword}
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                label="Password"
                                name="password"
                                type="password"
                                value={password}
                                onChange={this.onChange}
                                autoComplete="current-password"
                                helperText='The password must be between 6 and 40 characters!'
                            />
                            <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={disabled}
                            className="myDefaultMarginTopBottom"
                            >
                                {this.state.loading &&
                                    <span className="spinner-border spinner-border-sm"></span>
                                }
                                <span>Register</span>
                            </Button>
                            {this.state.message && (
                                <FormGroup>
                                    <Alert variant="danger" role="alert">
                                        {this.state.message}
                                    </Alert>
                                </FormGroup>
                            )}
                            <Grid container justify="flex-end">
                                <Grid item>
                                    <Link to={"/login"}
                                    className="myDefaultMarginTopBottom
                                    defaultFontSize secondaryColor">
                                        Already have an account? Sign in
                                    </Link>
                                </Grid>
                            </Grid>
                        </Form>
                    </div>
                </Container>
            </>
        );
    }
}
