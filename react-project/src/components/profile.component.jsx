import React, { Component } from "react";
import AuthService from "../services/auth.service";
import { Jumbotron, Container, ListGroup, InputGroup, FormControl, Button } from "react-bootstrap";

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
                    <Jumbotron>
                        <h3>Profile page</h3>
                    </Jumbotron>

                    {!this.state.edit &&
                    <p>
                        <strong>Name:</strong>{" "}
                        {this.state.currentUser.username}
                    </p>
                    }
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

                    {!this.state.edit &&
                    <p>
                        <strong>Email:</strong>{" "}
                        {this.state.currentUser.email}
                    </p>
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

                    {!this.state.edit &&
                    <p>
                        <strong>Authorities:</strong>
                        <ListGroup>
                            {this.state.currentUser.roles &&
                            this.state.currentUser.roles.map((role, index) => 
                            <ListGroup.Item key={index}>{role}</ListGroup.Item>)}
                        </ListGroup>
                    </p>
                    }

                    {!this.state.edit &&<Button className="btn btn-secondary" onClick={() => {
                        this.setState({ edit: true });
                    }}>Edit profile</Button>}

                    {this.state.edit &&
                    <Button className="btn btn-success" onClick={this.saveInformation}>Save</Button>}

                    <Button className="btn btn-danger" onClick={this.deleteProfile}>Delete Profile</Button>
                </Container>
            </>
        );
    }
}