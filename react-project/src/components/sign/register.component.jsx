import React, { Component } from 'react';
import authService from "../../services/user-auth/auth.service";

import { isEmail } from "validator";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { Col, Row, Card, Button, FormGroup, Alert } from 'react-bootstrap';
import FormBootstrap from 'react-bootstrap/Form';

const email = value => {
    if (!isEmail(value)) {
        return (
            <div className="alert alert-danger" role="alert">
                This is not a valid emial.
            </div>
        );
    } 
};

const required = value => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};


const vusername = value => {
    if (value.length < 3 || value.length > 20) {
        return (
            <div className="alert alert-danger" role="alert">
                The username must be between 3 and 20 characters!
            </div>
        );
    }
};

const vpassword = value => {
    if (value.length < 6 || value.length > 40) {
        return (
            <div className="alert alert-danger" role="alert">
                The password must be between 6 and 40 characters!
            </div>
        );
    }
};

export  default class Register extends Component {
    constructor(props) {
        super(props);
        this.handleRegister = this.handleRegister.bind(this);
        this.onChange = this.onChange.bind(this);

        this.state = {
            username: "",
            password: "",
            email: "",
            successful: false,
            message: ""
        };
    }

    onChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleRegister = event => {
        event.preventDefault();

        console.log("EEE PEDAL");

        this.setState({
            message: "",
            successful: false
        });

        this.form.validateAll();

        if (this.checkBtn.context._errors.length === 0) {
            authService.register(
                this.state.username,
                this.state.email,
                this.state.password
            ).then(
                response => {
                    this.setState({
                        message: response.data.message,
                        successful: true
                    });
                    authService.login(this.state.username, this.state.password).then(
                        () => {
                            this.props.history.push("/profile");
                            window.location.reload();
                        })
                },
                error => {
                    const resMessage = 
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                        error.message ||
                        error.toString()

                    this.setState({
                        successful: false,
                        message: resMessage
                    });
                }
            );
        }
    }

    render() {
        return (
            <>
                <Col className="md-6">
                    <Row className="justify-content-md-center">
                        <Card style={{ width: '54em', padding: '2rem' }} className="mx-auto my-4">
                            <Card.Title style={{ textAlign: 'center', fontSize: '2rem' }} >
                                Create an account
                            </Card.Title>
                            <Form
                                onSubmit={this.handleRegister}
                                ref={c => {
                                    this.form = c;
                                }}
                            >
                                <FormGroup>
                                    <FormBootstrap.Label htmlFor="username">Username</FormBootstrap.Label>
                                    <Input
                                        type="text"
                                        className="form-control"
                                        name="username"
                                        value={this.state.username}
                                        onChange={this.onChange}
                                        validattions={[required, vusername]}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <FormBootstrap.Label htmlFor="email">Email</FormBootstrap.Label>
                                    <Input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        value={this.state.email}
                                        onChange={this.onChange}
                                        validattions={[required, email]}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <FormBootstrap.Label htmlFor="password">Password</FormBootstrap.Label>
                                    <Input
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        value={this.state.password}
                                        onChange={this.onChange}
                                        validattions={[required, vpassword]}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        className="btn-block"
                                        disabled={this.state.loading}>
                                            Register
                                        </Button>
                                </FormGroup>
                                {this.state.message && (
                                    <FormGroup>
                                        {this.state.successful
                                        ? 
                                            <Alert variant="success" role="alert">
                                                {this.state.message}
                                            </Alert>
                                        :
                                            <Alert variant="danger" role="alert">
                                                {this.state.message}
                                            </Alert>
                                        }
                                    </FormGroup>
                                )}
                                <CheckButton
                                    style={{ display: "none" }}
                                    ref={c => {
                                        this.checkBtn = c;
                                    }}
                                />
                                </Form>
                        </Card>
                    </Row>
                </Col>
            </>
        );
    }
}
