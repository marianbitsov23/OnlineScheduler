import React from 'react';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import FormBootstrap from 'react-bootstrap/Form';

import { Component } from "react";
import authService from "../../services/auth.service";
import { Col, Card, FormGroup, Button, Alert, Row } from 'react-bootstrap';

const required = value => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};

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

        this.setState({
            message: "",
            loading: true
        });

        this.form.validateAll();

        if (this.checkBtn.context._errors.length === 0) {
            authService.login(this.state.username, this.state.password).then(
                () => {
                    this.props.history.push("/profile");
                    window.location.reload();
                },
                error => {
                    console.log(error)
                    const resMessage = 
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                        error.message ||
                        error.toString()

                    this.setState({
                        loading: false,
                        message: resMessage
                    });
                }
            );
        } else {
            this.setState({
                loading: false
            });
        }
    }

    render() {
        return (
            <>
                <Col className="md-6">
                    <Row className="justify-content-md-center">
                        <Card style={{ width: '54em', padding: '2rem' }} className="mx-auto my-4">
                            <Card.Title style={{ textAlign: 'center', fontSize: '2rem' }} >
                                Sign in
                            </Card.Title>
                            <Form
                                onSubmit={this.handleLogin}
                                ref={c => {
                                    this.form = c;
                                }}
                            >
                                <FormGroup>
                                    <FormBootstrap.Label htmlFor="username">Username</FormBootstrap.Label>
                                    <Input
                                        type="username"
                                        className="form-control"
                                        name="username"
                                        value={this.state.username}
                                        onChange={this.onChange}
                                        validattions={[required]}
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
                                        validattions={[required]}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Button
                                        type="submit"
                                        className="btn-primary btn-block"
                                        disabled={this.state.loading}>
                                            {this.state.loading &&
                                                <span className="spinner-border spinner-border-sm"></span>
                                            }
                                            <span>Login</span>
                                        </Button>
                                </FormGroup>
                                {this.state.message && (
                                    <FormGroup>
                                        <Alert variant="danger" role="alert">
                                            {this.state.message}
                                        </Alert>
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