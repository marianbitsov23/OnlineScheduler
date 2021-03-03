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

    logOut = () => authService.logout();

    render() {

        const currentUser = this.state.currentUser;

        return (
            <>
                <Navbar className="myDefaultPadding primaryBackground" expand="lg">
                    <Link to={"/"}>
                        <Navbar.Brand className="navTitle myWhiteColor">
                            OnlineScheduler
                        </Navbar.Brand>
                    </Link>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ml-auto navRoutes">
                            <Nav.Item>
                                <Link to={"/home"} className="nav-link navRoute myWhiteColor">
                                    Home
                                </Link>
                            </Nav.Item>

                            {currentUser && (
                            <Nav.Item>
                                <Link to={"/schedules"} className="nav-link navRoute myWhiteColor">
                                    Schedules
                                </Link>
                            </Nav.Item>
                            )}

                            <Nav.Item className="verticalItem">
                                <div className="vertical">
                                </div>
                            </Nav.Item>

                            {currentUser ? (
                                <>
                                    <Nav.Item>
                                        <Link to={"/profile"} className="nav-link navRoute myWhiteColor profileRoute">
                                            { currentUser.username }
                                        </Link>
                                    </Nav.Item>
                        
                                    <Nav.Item className="logOutRoute">
                                        <button>
                                            <a href="/login" className="nav-link navRoute myWhiteColor" onClick={this.logOut}>
                                                Log Out
                                            </a>
                                        </button>
                                    </Nav.Item>
                                </>
                                ) : (
                                <>
                                <Nav.Item>
                                    <Link to={"/login"} className="nav-link myWhiteColor navRoute profileRoute">
                                        Login
                                    </Link>
                                </Nav.Item>
                    
                                <Nav.Item className="logOutRoute">
                                    <button>
                                        <Link to={"/register"} className="nav-link navRoute">
                                            Sign Up
                                        </Link>
                                    </button>
                                </Nav.Item>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </>
        );
    }
}