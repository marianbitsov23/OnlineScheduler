import React, { Component } from "react";

import UserService from "../services/user.service";
import { Container, Jumbotron } from "react-bootstrap";

export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            content: ""
        };
    }

    componentDidMount() {
        UserService.getPublicContent().then(
        response => {
            this.setState({
                content: response.data
            });
        },
        error => {
            this.setState({
                content: error.message
            });
        }
        );
    }

    render() {
        return (
            <Container>
                <Jumbotron>
                    <h3>{this.state.content}</h3>
                </Jumbotron>
            </Container>
        );
    }
}