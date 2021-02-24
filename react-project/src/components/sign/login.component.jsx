import React from 'react';
import Form from "react-validation/build/form";
import { Component } from "react";
import { FormGroup, Alert } from 'react-bootstrap';
import authService from "../../services/user-auth/auth.service";
import { Avatar, Container, 
        Typography, Grid, Paper } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Link } from 'react-router-dom';
import { TextInput } from '../shared/text-input.component';
import { ConfirmButton } from '../shared/confirm-button.component';

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

    onChange = event => this.setState({[event.target.name] : event.target.value});

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

        const disabled =
            username === ''||
            password === '';

        return (
            <div className="
            myDisplayFlex 
            justifyContentCenter 
            alignItemsCenter 
            setFlexOne">
                <Paper className="backgroundPaper myDefaultPadding">
                    <Container component="main" maxWidth="xs">
                        <div className="
                        myDisplayFlexColumn 
                        alignItemsCenter
                        myDefaultMargin">
                            <Avatar
                                className="myDefaultMargin primaryBackground"
                            >
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                Влезте в своя профил
                            </Typography>
                            <Form onSubmit={this.handleLogin}>
                                <TextInput
                                    name="username"
                                    value={username}
                                    label="Потребителско име"
                                    autoComplete="username"
                                    variant="outlined"
                                    onChange={this.onChange}
                                />
                                <TextInput
                                    name="password"
                                    value={password}
                                    label="Парола"
                                    autoComplete="password"
                                    type="password"
                                    variant="outlined"
                                    onChange={this.onChange}
                                />
                                <ConfirmButton 
                                    disabled={disabled}
                                    loading={this.state.loading}
                                    text="Влизане"
                                />
                                {this.state.message && (
                                    <FormGroup>
                                        <Alert variant="danger" role="alert">
                                            {this.state.message}
                                        </Alert>
                                    </FormGroup>
                                )}
                                <Grid container>
                                    <Grid item xs>
                                        <Link to={"/forgot-password"} 
                                            className="myDefaultMarginTopBottom
                                            defaultFontSize secondaryColor"
                                        >
                                            Забравена парола?
                                        </Link>
                                    </Grid>
                                    <Grid item>
                                        <Link to={"/register"} 
                                            className="myDefaultMarginTopBottom
                                            defaultFontSize secondaryColor"
                                        >
                                            Нямаш профил? Регистрирай се сега!
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Form>
                        </div>
                    </Container>
                </Paper>
            </div>
        );
    }
}