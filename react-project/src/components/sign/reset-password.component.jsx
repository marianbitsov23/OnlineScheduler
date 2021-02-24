import React, { Component } from "react";
import Form from "react-validation/build/form";
import { FormGroup, Alert } from 'react-bootstrap';
import { Avatar, Container, 
        Typography, Paper } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import authService from "../../services/user-auth/auth.service";
import { TextInput } from '../shared/text-input.component';
import { ConfirmButton } from "../shared/confirm-button.component";

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

    onChange = event => this.setState({[event.target.name] : event.target.value});

    resetPassword = event => {
        event.preventDefault();

        this.setState({ loading: true });
        const { password, token } = this.state;

        authService.resetPassword(token, password)
        .then(result => this.setState({ message: result.data.message, alert: false, loading: false }))
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
                        <div 
                        className="myDisplayFlexColumn 
                        alignItemsCenter
                        myDefaultMargin">
                            <Avatar className="myDefaultMargin primaryBackground">
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                Променете паролата си
                            </Typography>
                            <Form onSubmit={this.resetPassword}>
                                <TextInput
                                    name="token"
                                    value={token}
                                    helperText="Въведете секретния ключ от електронната поща"
                                    label="Секретен ключ"
                                    autoComplete="text"
                                    variant="outlined"
                                    onChange={this.onChange}
                                />

                                <TextInput
                                    name="password"
                                    type="password"
                                    value={password}
                                    helperText="Въведете новата си парола"
                                    label="Нова парола"
                                    autoComplete="password"
                                    variant="outlined"
                                    onChange={this.onChange}
                                />

                                <TextInput
                                    name="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    helperText="Потвърдете новата си парола"
                                    label="Потвърдете паролата"
                                    autoComplete="password"
                                    variant="outlined"
                                    onChange={this.onChange}
                                />

                                <ConfirmButton
                                    disabled={isInvalid}
                                    loading={this.state.loading}
                                    text="Запази паролата"
                                />
                                {this.state.message && alert && (
                                    <FormGroup>
                                        <Alert variant="success" role="alert">
                                            {this.state.message}
                                        </Alert>
                                    </FormGroup>
                                )}
                                {this.state.message && !alert && (
                                    <FormGroup>
                                        <Alert variant="danger" role="alert">
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