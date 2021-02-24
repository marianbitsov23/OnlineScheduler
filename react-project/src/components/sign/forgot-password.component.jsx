import React, { Component } from "react";
import Form from "react-validation/build/form";
import { FormGroup, Alert } from "react-bootstrap";
import authService from "../../services/user-auth/auth.service";
import { Avatar, Container, 
        Typography, Grid, Paper } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Link } from 'react-router-dom';
import { isEmail } from "validator";
import { ConfirmButton } from "../shared/confirm-button.component";
import { TextInput } from '../shared/text-input.component';

export default class ForgotPassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            loading: false,
            message: "",
            alert: false,
            isInvalidEmail: false
        };
    }

    onChange = event => {
        this.setState({
            [event.target.name] : event.target.value,
            isInvalidEmail: !isEmail(event.target.value)
        });
    }

    forgotPassword = event => {
        event.preventDefault();

        this.setState({ loading: true });
        const { email } = this.state;

        authService.forgotPassword(email)
        .then(result => this.setState({ message: result.data.message, alert: false, loading: false }))
        .catch(error => {
            const response = 
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                        error.message ||
                        error.toString()
            this.setState({ message: response, alert: true, loading: false });
        });
    }

    render() {
        const { email, isInvalidEmail, alert } = this.state;

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
                                Забравена парола
                            </Typography>
                            <Form onSubmit={this.forgotPassword}>
                                <TextInput
                                    name="email"
                                    value={email}
                                    label="Електронна поща"
                                    autoComplete="email"
                                    variant="outlined"
                                    onChange={this.onChange}
                                    helperText='Въведете валидна електронна поща example@emp.com'
                                />
                                <ConfirmButton
                                    disabled={isInvalidEmail}
                                    loading={this.state.loading}
                                    text="Изпрати електронна поща"
                                />
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
                                <Grid container justify="flex-end">
                                    <Grid item>
                                        <Link to={"/login"} 
                                        className="myDefaultMarginTopBottom
                                        defaultFontSize secondaryColor">
                                            Спомнихте си я? Влезте в профила си
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Form>
                        </div>
                    </Container>
                </Paper>
            </div>
        )
    }
}