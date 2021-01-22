import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import FormBootstrap from 'react-bootstrap/Form';
import { Card, Button, Row, Col, FormGroup, Alert } from "react-bootstrap";
import authService from "../../services/user-auth/auth.service";

const required = value => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};


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
            <Col className="md-6">
                    <Row className="justify-content-md-center">
                        <Card style={{ width: '36em', padding: '2rem' }} className="mx-auto my-4">
                            <Card.Title style={{ textAlign: 'center', fontSize: '2rem' }} >
                                Reset your password
                            </Card.Title>
                            <Form
                                onSubmit={this.resetPassword}
                                ref={c => {
                                    this.form = c;
                                }}
                            >
                                <FormGroup>
                                    <FormBootstrap.Label htmlFor="token">Security key</FormBootstrap.Label>
                                    <Input
                                        type="password"
                                        className="form-control"
                                        name="token"
                                        value={this.state.token}
                                        onChange={this.onChange}
                                        validattions={[required]}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <FormBootstrap.Label htmlFor="password">New password</FormBootstrap.Label>
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
                                    <FormBootstrap.Label htmlFor="confirmPassword">Confirm password</FormBootstrap.Label>
                                    <Input
                                        type="password"
                                        className="form-control"
                                        name="confirmPassword"
                                        value={this.state.confirmPassword}
                                        onChange={this.onChange}
                                        validattions={[required]}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        className="btn-block"
                                        disabled={isInvalid}>
                                            {this.state.loading &&
                                                <span className="spinner-border spinner-border-sm"></span>
                                            }
                                            <span>Save password</span>
                                        </Button>
                                </FormGroup>

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
        )
    }
}