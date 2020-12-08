import React, { Component } from "react";
import AuthService from "../services/auth.service";
import { Container, InputGroup, FormControl, Button, Card, Row, Col } from "react-bootstrap";

export default class Profile extends Component {
    constructor(props) {
        super(props);

        this.saveInformation = this.saveInformation.bind(this);
        this.deleteProfile = this.deleteProfile.bind(this);

        this.state = {
            currentUser: AuthService.getCurrentUser(),
            username: AuthService.getCurrentUser().username,
            email: AuthService.getCurrentUser().email,
            edit: false
        };
    }

    onChange = event => {
        event.preventDefault();

        this.setState({ [event.target.name] : event.target.value });
    }

    deleteProfile = event => {
        event.preventDefault();

        AuthService.deleteUser(this.state.currentUser.id)
        .then(AuthService.logout())
        .then(this.props.history.push("/login"));
    }

    saveInformation = event => {
        event.preventDefault();

        const newUser = {
            username: this.state.username, 
            password: this.state.currentUser.password,
            roles: this.state.currentUser.roles,
            email: this.state.email,
            id: this.state.currentUser.id
        }

        AuthService.udpateUser(
            this.state.username, 
            this.state.currentUser.password,
            this.state.currentUser.roles,
            this.state.email,
            this.state.currentUser.id)
        .then(() => {
          this.setState({ edit: false });
        });
    }

    render() {

        return (
            <>
                <Container>
                    <Row className="justify-content-md-center">
                        <Card bg="secondary" text="white" style={{ width: '24rem' }}>
                            <Card.Img
                                variant="top" 
                                src="https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png" 
                                height="300"
                            />
                            {!this.state.edit &&
                                <Card.Header>{this.state.currentUser.username}</Card.Header>
                            }
                            <Card.Body>
                                <Card.Title>{this.state.currentUser.email}</Card.Title>
                                <Card.Text>
                                <Col>
                                    {!this.state.edit &&
                                    <Row>
                                        <Button variant="success" className="btn-margin" 
                                            onClick={() => {
                                                this.setState({ edit: true });
                                            }}
                                        >
                                            Edit profile
                                        </Button>
                                    </Row>
                                    }
                                    {this.state.edit &&
                                    <Row>
                                        <Button variant="success" onClick={this.saveInformation}>
                                            Save
                                        </Button>
                                    </Row>
                                    }
                                    <Row>
                                        <Button variant="danger" onClick={this.deleteProfile}>
                                            Delete Profile
                                        </Button>
                                    </Row>
                                </Col>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Row>
                    {this.state.edit &&
                    <InputGroup className="mb-3">
                        <FormControl
                            onChange={this.onChange}
                            name="username"
                            value={this.state.username}
                            placeholder="Username"
                            aria-label="Username"
                        />
                    </InputGroup>
                    }

                    {this.state.edit &&
                    <InputGroup className="mb-3">
                        <FormControl
                            onChange={this.onChange}
                            name="email"
                            value={this.state.email}
                            placeholder="Email"
                            aria-label="Email"
                            aria-describedby="basic-addon2"
                        />
                        <InputGroup.Append>
                            <InputGroup.Text id="basic-addon2">@example.com</InputGroup.Text>
                        </InputGroup.Append>
                    </InputGroup>
                    }
                </Container>
            </>
        );
    }
}