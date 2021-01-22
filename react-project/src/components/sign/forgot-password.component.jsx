import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import FormBootstrap from 'react-bootstrap/Form';
import { Card, Button, Row, Col, FormGroup, Alert } from "react-bootstrap";
import LockIcon from '@material-ui/icons/Lock';
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


export default class ForgotPassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            loading: false,
            message: "",
            alert: false
        };
    }

    onChange = event => {
        this.setState({[event.target.name] : event.target.value});
    }

    forgotPassword = event => {
        event.preventDefault();

        this.setState({ loading: true });
        const { email } = this.state;

        authService.forgotPassword(email)
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
        return(
            <Col className="md-6">
                    <Row className="justify-content-md-center">
                        <Card style={{ width: '36em', padding: '2rem' }} className="mx-auto my-4">
                            <Card.Title style={{ textAlign: 'center', fontSize: '2rem' }} >
                                Reset my password
                            </Card.Title>
                            <Row  className="justify-content-md-center">
                                <LockIcon fontSize="large" />
                            </Row>
                            <Form
                                onSubmit={this.forgotPassword}
                                ref={c => {
                                    this.form = c;
                                }}
                            >
                                <FormGroup>
                                    <FormBootstrap.Label htmlFor="username">Email</FormBootstrap.Label>
                                    <Input
                                        type="text"
                                        className="form-control"
                                        name="email"
                                        placeholder="example@example.com"
                                        value={this.state.email}
                                        onChange={this.onChange}
                                        validattions={[required]}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        className="btn-block"
                                        disabled={this.state.loading}>
                                            {this.state.loading &&
                                                <span className="spinner-border spinner-border-sm"></span>
                                            }
                                            <span>Send email</span>
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