import React, { Component } from 'react';
import authService from "../../services/user-auth/auth.service";
import { FormGroup, Alert } from 'react-bootstrap';
import { isEmail } from "validator";
import Form from "react-validation/build/form";
import { Avatar, Container, 
        Typography, Grid, Paper } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Link } from 'react-router-dom';
import { TextInput } from '../shared/text-input.component';
import { ConfirmButton } from '../shared/confirm-button.component';

export default class Register extends Component {
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
            confirmPassword: "",
            isInvalidUsername: false,
            isInvalidEmail: false,
            isInvalidPassword: false,
            isInvalidConfirmPasword: false
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
            case 'confirmPassword':
                this.setState({
                    isInvalidConfirmPasword:
                        event.target.value.length < 6 ||
                        event.target.value.length > 40 ||
                        event.target.value !== this.state.password  
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
        const{ username, email, password, confirmPassword, 
            isInvalidUsername, isInvalidEmail, isInvalidPassword,
            isInvalidConfirmPasword } = this.state;
        
            const disabled =
                isInvalidUsername ||
                isInvalidEmail ||
                isInvalidPassword;
        return (
            <div className="
            myDisplayFlex 
            justifyContentCenter 
            alignItemsCenter 
            setFlexOne">
            <Paper className="backgroundPaper myDefaultPadding">
                <Container component="main" maxWidth="xs">
                    <div className="myDisplayFlexColumn 
                    alignItemsCenter
                    myDefaultMargin">
                        <Avatar className="myDefaultMargin primaryBackground">
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Създаване на профил
                        </Typography>
                        <Form onSubmit={this.handleRegister}>
                            <TextInput
                                error={isInvalidUsername}
                                name="username"
                                value={username}
                                helperText="Потребителското име трябва да бъде между 3 и 20 символа!"
                                label="Потребителско име"
                                autoComplete="username"
                                variant="outlined"
                                onChange={this.onChange}
                            />
                            <TextInput
                                error={isInvalidEmail}
                                name="email"
                                value={email}
                                helperText="Въведете валидна електронна поща example@emp.com"
                                label="Електронна поща"
                                autoComplete="email"
                                variant="outlined"
                                onChange={this.onChange}
                            />
                            <TextInput
                                error={isInvalidPassword}
                                name="password"
                                value={password}
                                helperText="Паролата трябва да бъде между 6 и 40 символа!"
                                label="Парола"
                                autoComplete="password"
                                type="password"
                                variant="outlined"
                                onChange={this.onChange}
                            />
                            <TextInput
                                error={isInvalidConfirmPasword}
                                name="confirmPassword"
                                value={confirmPassword}
                                helperText="Паролите трябва да съвпадат!"
                                label="Потвърдете паролата"
                                autoComplete="password"
                                type="password"
                                variant="outlined"
                                onChange={this.onChange}
                            />
                            <ConfirmButton 
                                disabled={disabled}
                                loading={this.state.loading}
                                text="Регистрирай се"
                            />
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
                                        defaultFontSize secondaryColor"
                                    >
                                        Вече имаш акаунт? Влезте в него
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
