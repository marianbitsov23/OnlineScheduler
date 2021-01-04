import React, { Component } from "react";

import UserService from "../services/user.service";
import { Container, Jumbotron, Row, Button } from "react-bootstrap";
import { Link } from 'react-router-dom';

export default class ScheduleBoard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            content: ""
        };
    }

    componentDidMount() {
        UserService.getUserBoard().then(
        response => {
            this.setState({
                content: response.data
            });
        },
        error => {
            this.setState({
                content:
                    (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                    error.message ||
                    error.toString()
            });
        }
        );
    }

    render() {
        return (
            <>
                <Container>
                    <Jumbotron>
                        Schedules
                    </Jumbotron>
                    <Row className="justify-content-md-center">
                        <Link to={"/create-schedule"}>
                            <Button variant="info">Create new schedule</Button>
                        </Link>
                    </Row>
                </Container>
            </>
        );
    }
}