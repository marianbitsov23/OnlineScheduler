import React, { Component } from "react";
import Form from "react-validation/build/form";
import { FormGroup, Alert } from 'react-bootstrap';
import { Avatar, CssBaseline, Container, 
    Typography, TextField, Button, Paper } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import authService from "../../services/user-auth/auth.service";

export default class ResetPassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            password: "",
            confirmPassword: "",
            token: "",
            loading: false,
            message: "",
            alert: false
        };
    }

    onChange = event => {
        this.setState({[event.target.name] : event.target.value});
    }

    resetPassword = event => {
        event.preventDefault();

        this.setState({ loading: true });
        const { password, token } = this.state;

        authService.resetPassword(token, password)
        .then(result => {
            console.log(result.data);
            this.setState({ message: result.data.message, alert: false, loading: false });
        })
        .catch(error => {
            console.error(error);
            this.setState({ message: error.message, alert: true, loading: false });
        });
    }

    render() {
        const { password, confirmPassword, token } = this.state;

        const isInvalid = 
            password === '' || 
            token === ''||
            confirmPassword === '' ||
            password !== confirmPassword;

        return(
            <div className="
            myDisplayFlex 
            justifyContentCenter 
            alignItemsCenter 
            setFlexOne">
                <Paper className="backgroundPaper myDefaultPadding">
                    <Container component="main" maxWidth="xs">
                        <CssBaseline />
                        <div 
                        className="myDisplayFlexColumn 
                        alignItemsCenter
                        myDefaultMargin">
                            <Avatar className="myDefaultMargin primaryBackground">
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                Reset your password
                            </Typography>
                            <Form onSubmit={this.resetPassword}>
                                <TextField
                                type="text"
                                name="token"
                                value={token}
                                onChange={this.onChange}
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                label="Security key"
                                onChange={this.onChange}
                                autoComplete="text"
                                helperText='Enter the token that was sent to your email'
                                />

                                <TextField
                                type="password"
                                name="password"
                                value={password}
                                onChange={this.onChange}
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                label="New Password"
                                onChange={this.onChange}
                                autoComplete="password"
                                helperText='Enter your new secure password'
                                />

                                <TextField
                                type="password"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={this.onChange}
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                label="Confirm New Password"
                                onChange={this.onChange}
                                autoComplete="password"
                                helperText='Confirm your new secure password'
                                />
                                <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                disabled={isInvalid}
                                className="myDefaultMarginTopBottom">
                                    {this.state.loading &&
                                        <span className="spinner-border spinner-border-sm"></span>
                                    }
                                    <span>Save Password</span>
                                </Button>
                                {this.state.message && alert && (
                                <FormGroup>
                                    <Alert variant="danger" role="alert">
                                        {this.state.message}
                                    </Alert>
                                </FormGroup>
                                )}
                                {this.state.message && !alert && (
                                <FormGroup>
                                    <Alert variant="success" role="alert">
                                        {this.state.message}
                                    </Alert>
                                </FormGroup>
                                )}
                            </Form>
                        </div>
                    </Container>
                </Paper>
            </div>
        )
    }
}