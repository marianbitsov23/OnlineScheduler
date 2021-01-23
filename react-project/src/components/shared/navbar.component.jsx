import React, { Component } from 'react';
import authService from '../../services/user-auth/auth.service';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';


export default class Navigation extends Component {
    constructor(props) {
        super(props);
        this.logOut.bind(this);

        this.state = {
            currentUser: undefined
        };
    }

    componentDidMount() {
        const currentUser = authService.getCurrentUser();

        if (currentUser) this.setState({currentUser: currentUser});
    }

    logOut() {
        authService.logout();
    }

    render() {

        const currentUser = this.state.currentUser;

        return (
            <>
                <Navbar className="myDefaultPadding baseColor" variant="dark" expand="lg">
                    <Link to={"/"}>
                        <Navbar.Brand>OnlineScheduler</Navbar.Brand>
                    </Link>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Item>
                                <Link to={"/home"} className="nav-link">
                                    Home
                                </Link>
                            </Nav.Item>

                            {currentUser && (
                            <Nav.Item>
                                <Link to={"/schedules"} className="nav-link white">
                                    Schedules
                                </Link>
                            </Nav.Item>
                            )}
                        </Nav>

                    {currentUser ? (
                        <Nav className="ml-auto">
                            <Nav.Item>
                                <Link to={"/profile"} className="nav-link">
                                    { currentUser.username }
                                </Link>
                            </Nav.Item>
                
                            <Nav.Item>
                                <a href="/login" className="nav-link" onClick={this.logOut}>
                                    Log Out
                                </a>
                            </Nav.Item>
                        </Nav>
                    ) : (
                        <Nav className="ml-auto">
                            <Nav.Item>
                                <Link to={"/login"} className="nav-link">
                                    Login
                                </Link>
                            </Nav.Item>
                
                            <Nav.Item>
                                <Link to={"/register"} className="nav-link">
                                    Sign Up
                                </Link>
                            </Nav.Item>
                        </Nav>
                    )}
                    </Navbar.Collapse>
                </Navbar>
            </>
        );
    }
}