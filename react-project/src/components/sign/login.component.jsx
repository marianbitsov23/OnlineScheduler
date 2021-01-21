import React from 'react';
import Form from "react-validation/build/form";
import { Component } from "react";
import { FormGroup, Alert } from 'react-bootstrap';
import authService from "../../services/user-auth/auth.service";
import { Avatar, CssBaseline, Container, 
        Typography, TextField, Button, Grid } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Link } from 'react-router-dom';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.onChange = this.onChange.bind(this);

        this.state = {
            username: "",
            password: "",
            loading: false,
            message: ""
        };
    }

    onChange = event => {
        this.setState({
            [event.target.name] : event.target.value
        });
    }

    handleLogin = event => {
        event.preventDefault();

        this.setState({ message: "", loading: true});

        authService.login(this.state.username, this.state.password)
        .then(() => {
            this.props.history.push("/profile");
            window.location.reload();
        })
        .catch(error => {
            this.setState({
                loading: false,
                message: error.message
            });
        });
    }

    render() {
        const { username, password } = this.state;

        return (
            <>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <div style={{
                        marginTop: '.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                        <Avatar style={{
                            margin: '1rem',
                            backgroundColor: 'red'
                        }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign In
                        </Typography>
                        <Form style={{}} onSubmit={this.handleLogin}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                label="Username"
                                name="username"
                                value={username}
                                onChange={this.onChange}
                                autoComplete="text"
                            />
                            <TextField
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
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                style={{ marginBottom: '1rem'}}
                            >
                                {this.state.loading &&
                                    <span className="spinner-border spinner-border-sm"></span>
                                }
                                <span>Login</span>
                            </Button>
                            {this.state.message && (
                                <FormGroup>
                                    <Alert variant="danger" role="alert">
                                        {this.state.message}
                                    </Alert>
                                </FormGroup>
                            )}
                            <Grid container>
                                <Grid item xs>
                                    <Link to={"/forgot-password"} className="nav-link">
                                        Forgot Password
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link to={"/register"} className="nav-link">
                                        Don't have an account? Sign Up
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