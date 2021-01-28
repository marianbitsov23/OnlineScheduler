import React, { Component } from 'react';
import { Container, Jumbotron, FormGroup, Button, Alert } from 'react-bootstrap';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import FormBootstrap from 'react-bootstrap/Form';
import scheduleService from "../../services/schedule/schedule.service";
import authService from '../../services/user-auth/auth.service';


export default class ManageSchedules extends Component {
    constructor(props) {
        super(props);

        this.state = {
            scheduleName: "",
            description: "",
            schoolName: "",
            creator: authService.getCurrentUser(),
            message: "",
            loading: false
        };

        this.saveSchedule.bind(this);
        this.onChange.bind(this);
    }

    saveSchedule = event => {
        event.preventDefault();

        this.setState({
            message: "",
            loading: true
        });

        this.form.validateAll();

        const { scheduleName, description, creator, schoolName } = this.state;

        const updatedUser = {
            id: creator.id,
            username: creator.username,
            email: creator.email,
            password: creator.password,
            accessToken: creator.accessToken,
            tokenType: creator.tokenType
        };


        scheduleService.createSchedule(scheduleName, description, updatedUser, schoolName)
        .then(result => {
            //add schedule to the current user

            let schedules = [];

            schedules.push(result.data);

            scheduleService.saveCurrentSchedule(result.data);

            updatedUser.roles = creator.roles;
            updatedUser.schedules = schedules;
            //TODO extract this
            localStorage.setItem("user", JSON.stringify(updatedUser));
        })
        .then(() => {
            // redirect to subject input
            this.props.history.push('/tim-table-management');
        })
        .catch(error => {
            console.error(error);
        });


    }

    onChange = event => {
        this.setState({ [event.target.name] : event.target.value });
    }

    render() {

        const isInvalid = this.state.scheduleName === "";

        return(
            <>
                <Container>
                    <Jumbotron fluid>
                        <Container>
                            <h1>Create your schedule</h1>
                            <p>Enter the schedule name, small description about it 
                            and then proceed to enter the information about it!</p>
                        </Container>
                    </Jumbotron>

                    <Form
                        onSubmit={this.saveSchedule}
                        ref={c => {
                            this.form = c;
                        }}
                    >
                        <FormGroup>
                            <FormBootstrap.Label htmlFor="scheduleName">Schedule name</FormBootstrap.Label>
                            <Input
                                type="scheduleName"
                                className="form-control"
                                name="scheduleName"
                                value={this.state.scheduleName}
                                onChange={this.onChange}
                            />
                        </FormGroup>

                        <FormGroup>
                            <FormBootstrap.Label htmlFor="description">Description</FormBootstrap.Label>
                            <Input
                                type="textarea"
                                className="form-control"
                                name="description"
                                value={this.state.description}
                                onChange={this.onChange}
                            />
                        </FormGroup>

                        <FormGroup>
                            <FormBootstrap.Label htmlFor="schoolName">School name</FormBootstrap.Label>
                            <Input
                                type="textarea"
                                className="form-control"
                                name="schoolName"
                                value={this.state.schoolName}
                                onChange={this.onChange}
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
                                    <span>Continue</span>
                                </Button>
                        </FormGroup>
                        {this.state.message && (
                            <FormGroup>
                                <Alert variant="danger" role="alert">
                                    {this.state.message}
                                </Alert>
                            </FormGroup>
                        )}
                    </Form>                    
                </Container>
            </>
        );
    }
}