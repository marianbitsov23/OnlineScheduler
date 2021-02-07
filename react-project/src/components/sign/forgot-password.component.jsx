import React, { Component } from "react";
import Form from "react-validation/build/form";
import { FormGroup, Alert } from "react-bootstrap";
import authService from "../../services/user-auth/auth.service";
import { Avatar, CssBaseline, Container, 
    Typography, TextField, Button, Grid, Paper } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Link } from 'react-router-dom';
import { isEmail } from "validator";

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
        .then(result => {
            this.setState({ message: result.data.message, alert: false, loading: false });
        })
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
                        <CssBaseline />
                        <div 
                        className="myDisplayFlexColumn 
                        alignItemsCenter
                        myDefaultMargin">
                            <Avatar className="myDefaultMargin primaryBackground">
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                Forgot password
                            </Typography>
                            <Form onSubmit={this.forgotPassword}>
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
                                <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                disabled={isInvalidEmail}
                                className="myDefaultMarginTopBottom">
                                    {this.state.loading &&
                                        <span className="spinner-border spinner-border-sm"></span>
                                    }
                                    <span>Send email</span>
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
                                <Grid container justify="flex-end">
                                    <Grid item>
                                        <Link to={"/login"} 
                                        className="myDefaultMarginTopBottom
                                        defaultFontSize secondaryColor">
                                            You remembered it? Sign in
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