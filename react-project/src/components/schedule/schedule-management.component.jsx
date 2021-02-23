import React, { Component } from 'react';
import { Container, Jumbotron, FormGroup, Modal, Alert } from 'react-bootstrap';
import Form from "react-validation/build/form";
import FormBootstrap from 'react-bootstrap/Form';
import scheduleService from "../../services/schedule/schedule.service";
import authService from '../../services/user-auth/auth.service';
import { Button, TextField } from '@material-ui/core';
import subjectService from '../../services/schedule/subject.service';
import teacherService from '../../services/schedule/teacher.service';
import cabinetService from '../../services/schedule/cabinet/cabinet.service';
import cabinetCategoryService from '../../services/schedule/cabinet/cabinet-category.service';
import timeTableService from '../../services/schedule/time-management/time-table.service';
import teachingHourService from '../../services/schedule/teaching-hour.service';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
import groupService from '../../services/schedule/group.service';
import lessonService from '../../services/schedule/lesson.service';
import { ConfirmButton } from '../shared/confirm-button.component';

export default class ManageSchedules extends Component {
    constructor(props) {
        super(props);

        this.state = {
            scheduleName: "",
            description: "",
            schoolName: "",
            schoolType: "middleSchool",
            creator: authService.getCurrentUser(),
            message: "",
            loading: false,
            show: false,
            schedules: [],
            selectedSchedule: 0,
            newSchedule: undefined
        };

        this.saveSchedule.bind(this);
        this.saveFromExistingSchedule = this.saveFromExistingSchedule.bind(this);
        this.onChange.bind(this);
    }

    componentDidMount() {
        scheduleService.getSchedulesByCreatorId(this.state.creator.id)
        .then(result => this.setState({ schedules: result.data }))
        .catch(error => console.error(error));
    }

    saveSchedule = (event) => {
        event.preventDefault();
        const { scheduleName, description, creator, schoolName, schoolType } = this.state;
        creator.roles = [];
        
        this.setState({ message: "", loading: true });

        this.saveScheduleInDb(scheduleName, description, creator, schoolName, schoolType, this.redirectToNextPage);
    }

    saveScheduleInDb = async (scheduleName, description, creator, schoolName, schoolType, onCreatedSchedule) => {
        scheduleService.createSchedule(scheduleName, description, creator, schoolName, schoolType.toUpperCase())
        .then(result => {
            //add schedule to the current user
            let schedules = creator.schedules ? creator.schedules : [];
            schedules.push(result.data);

            //saves current schedule in the local storage
            scheduleService.saveCurrentSchedule(result.data);

            creator.schedules = schedules;

            //saves current user in the local storage
            authService.setCurrentUser(creator);

            const oldScheduleId = this.state.schedules 
                ? this.state.schedules[this.state.selectedSchedule].id
                : undefined;

            onCreatedSchedule(result.data, oldScheduleId);

            this.setState({ newSchedule: result.data });

        })
        .catch(error => console.error(error));
    }

    saveFromExistingSchedule = () => {
        const { 
            scheduleName,
            description,
            schoolName,
            schoolType,
            creator } = this.state;

        this.setState({ loading: true });

        creator.roles = [];

        this.saveScheduleInDb(scheduleName, description, creator, schoolName, schoolType, this.copyExistingSchedule);
        //copy the information in the newSchedule
    }

    copyExistingSchedule = (newSchedule, oldScheduleId) => {
        this.fetchAndSaveElements(subjectService, newSchedule, oldScheduleId);
        this.fetchAndSaveElements(teacherService, newSchedule, oldScheduleId);
        this.fetchAndSaveElements(cabinetService, newSchedule, oldScheduleId);
        this.fetchAndSaveElements(groupService, newSchedule, oldScheduleId);
        this.fetchAndSaveElements(cabinetCategoryService, newSchedule, oldScheduleId);
        this.fetchAndSaveElements(timeTableService, newSchedule, oldScheduleId);
        this.fetchAndSaveElements(teachingHourService, newSchedule, oldScheduleId);
        this.fetchAndSaveElements(lessonService, newSchedule, oldScheduleId);
        
        this.redirectToNextPage();
    }

    redirectToNextPage = () => this.props.history.push('/schedule-dashboard');

    copyElements = (service, elements, schedule) => {
        elements.forEach(element => {
            element.schedule = schedule;
            service.create(element)
            .catch(error => console.error(error));
        });
    }

    fetchAndSaveElements = (service, schedule, oldScheduleId) => {
        service.getAllByScheduleId(oldScheduleId)
        .then(result => {
            this.copyElements(service, result.data, schedule);
        })
        .catch(error => console.error(error));
    }

    onChange = event => this.setState({ [event.target.name] : event.target.value });

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
                            <h1>Създайте своя график</h1>
                            <p>Въведете името на граика, кратко описание за него
                            и послете продължетете с въвъеждането на информацията за училищетп!</p>
                        </Container>
                    </Jumbotron>

                    <Form onSubmit={this.saveSchedule}>
                        <FormGroup>
                            <TextField
                                label="Име на графика"
                                placeholder="Въвъедете името на графика"
                                helperText="Example: ScheduleName_1_Morning"
                                fullWidth
                                className="myFontFamily"
                                margin="normal"
                                name="scheduleName"
                                value={this.state.scheduleName}
                                onChange={this.onChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </FormGroup>

                        <FormGroup>
                            <TextField
                                label="Описание"
                                placeholder="Въведете малко описание за графика"
                                fullWidth
                                margin="normal"
                                name="description"
                                value={this.state.description}
                                onChange={this.onChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </FormGroup>

                        <FormGroup>
                            <TextField
                                label="Име на училище"
                                placeholder="Напишете името на училището, за което се отнася графика"
                                fullWidth
                                margin="normal"
                                name="schoolName"
                                value={this.state.schoolName}
                                onChange={this.onChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </FormGroup>

                        <FormGroup>
                            <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                                Тип
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-placeholder-label-label"
                                id="demo-simple-select-placeholder-label"
                                name="schoolType"
                                fullWidth
                                labelId="demo-simple-select-helper-label"
                                value={this.state.schoolType}
                                onChange={this.onChange}
                            >
                                <MenuItem value={"middleSchool"}>Средно</MenuItem>
                                <MenuItem value={"highSchool"}>Гимназиално</MenuItem>
                            </Select>
                            <FormHelperText>
                                Изберете типа на училището, за да се генерират определения брой випуски
                            </FormHelperText>
                        </FormGroup>

                        <FormGroup>
                            <ConfirmButton
                                disabled={isInvalid}
                                loading={this.state.loading}
                                text="Създаване"
                            />
                        </FormGroup>

                        <div className="myDisplayFlex">
                            <hr/>
                            <div>
                                ИЛИ
                            </div>
                            <hr/>
                        </div>

                        <Button
                            fullWidth
                            variant="contained"
                            color="secondary"
                            className="myDefaultMarginTopBottom"
                            onClick={() => this.setState({ show: true })}
                        >
                            {this.state.loading &&
                                <span className="spinner-border spinner-border-sm"></span>
                            }
                            <span>Създаване от вече съществуващ</span>
                        </Button>

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
                            <Modal.Title>Създаване от вече съществуващ</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <FormGroup>
                                <FormBootstrap.Label>Изберете график</FormBootstrap.Label>
                                <FormBootstrap.Control 
                                    as="select" 
                                    name="selectedSchedule" 
                                    value={selectedSchedule} 
                                    onChange={this.onChange}>
                                        {schedules && schedules.map((schedule, index) => (
                                            <option key={schedule.id} value={index}>{schedule.name}</option>
                                        ))}
                                </FormBootstrap.Control>
                            </FormGroup>

                            <FormGroup>
                                <TextField
                                    label="Schedule Name"
                                    placeholder="Enter the schedule name"
                                    helperText="Example: ScheduleName_1_Morning"
                                    fullWidth
                                    margin="normal"
                                    name="scheduleName"
                                    value={this.state.scheduleName}
                                    onChange={this.onChange}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </FormGroup>

                            <FormGroup>
                                <TextField
                                    label="Description"
                                    placeholder="Enter small description for the schedule"
                                    fullWidth
                                    margin="normal"
                                    name="description"
                                    value={this.state.description}
                                    onChange={this.onChange}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </FormGroup>

                            <FormGroup>
                                <TextField
                                    label="School Name"
                                    placeholder="Enter the school this schedule is for"
                                    fullWidth
                                    margin="normal"
                                    name="schoolName"
                                    value={this.state.schoolName}
                                    onChange={this.onChange}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </FormGroup>
                            <p>
                                Цялата информация от избрания графи ще бъде копирана.
                                Без името и описанието.
                            </p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                            onClick={this.saveFromExistingSchedule}
                            variant="contained"
                            //disabled={isInvalid}
                            color="primary">
                                Създаване
                            </Button>
                        </Modal.Footer>
                    </Modal>                    
                </Container>
            </>
        );
    }
}