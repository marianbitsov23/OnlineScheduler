import React, { Component } from 'react';
import { Container, Jumbotron, FormGroup, Modal, Alert } from 'react-bootstrap';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import FormBootstrap from 'react-bootstrap/Form';
import scheduleService from "../../services/schedule/schedule.service";
import authService from '../../services/user-auth/auth.service';
import { Button, TextField } from '@material-ui/core';

export default class ManageSchedules extends Component {
    constructor(props) {
        super(props);

        this.state = {
            scheduleName: "",
            description: "",
            schoolName: "",
            creator: authService.getCurrentUser(),
            message: "",
            loading: false,
            show: false,
            schedules: [],
            selectedSchedule: 0
        };

        this.saveSchedule.bind(this);
        this.onChange.bind(this);
    }

    componentDidMount() {
        scheduleService.getSchedulesByCreatorId(this.state.creator.id)
        .then(result => {
            this.setState({ schedules: result.data });
        })
        .catch(error => {
            console.error(error);
        });
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
            this.props.history.push('/time-table-management');
        })
        .catch(error => {
            console.error(error);
        });


    }

    saveFromExistingSchedule = event => {

    }

    onChange = event => {
        this.setState({ [event.target.name] : event.target.value });
    }

    render() {

        const { show, selectedSchedule, schedules } = this.state;

        const isInvalid = 
            this.state.scheduleName === "" ||
            this.state.description === "" ||
            this.state.schoolName === "";

        return(
            <>
                <Container>
                    <Jumbotron fluid>
                        <Container>
                            <h1>Create your schedule</h1>
                            <p>Enter the schedule name, small description 
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
                        <TextField
                        id="standard-full-width"
                        label="Schedule Name"
                        placeholder="Enter the schedule name"
                        helperText="Example: ScheduleName_1_Morning"
                        fullWidth
                        className="myFontFamily"
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        />
                        </FormGroup>

                        <FormGroup>
                        <TextField
                        id="standard-full-width"
                        label="Description"
                        placeholder="Enter small description for the schedule"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        />
                        </FormGroup>

                        <FormGroup>
                        <TextField
                        id="standard-full-width"
                        label="School Name"
                        placeholder="Enter the school this schedule is for"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        />
                        </FormGroup>

                        <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        className="myDefaultMarginTopBottom"
                        onClick={() => this.setState({ show: true })}
                        >
                            {this.state.loading &&
                                <span className="spinner-border spinner-border-sm"></span>
                            }
                            <span>Create from existing</span>
                        </Button>

                        <FormGroup>
                            <Button
                            type="submit"
                            variant="contained"
                            color="secondary"
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
                    <Modal 
                    size="lg"
                    show={show}
                    onHide={() => this.setState({ show: !show })}
                    centered
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Create from existing schedule</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <FormGroup>
                                <FormBootstrap.Label>Choose schedule</FormBootstrap.Label>
                                <FormBootstrap.Control 
                                as="select" 
                                name="selectedSchedule" 
                                value={this.state.selectedSchedule} 
                                onChange={this.onChange}>
                                    {schedules && schedules.map((schedule, index) => (
                                        <option key={schedule.id} value={index}>{schedule.name}</option>
                                    ))}
                                </FormBootstrap.Control>
                            </FormGroup>
                            <p>
                                This will copy all the information about the selected schedule.
                                Without the name and the description.
                            </p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                            onClick={this.saveFromExistingSchedule}
                            variant="contained"
                            color="secondary">
                                Create
                            </Button>
                        </Modal.Footer>
                    </Modal>                    
                </Container>
            </>
        );
    }
}