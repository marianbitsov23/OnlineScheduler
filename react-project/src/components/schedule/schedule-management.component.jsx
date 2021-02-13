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
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';

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
            subjects: [],
            categories: [],
            teachers: [],
            cabinets: [],
            timeTables: [],
            teachingHours: [],
            groups: [],
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

    saveSchedule = (event, existing) => {
        event.preventDefault();
        const { scheduleName, description, creator, schoolName, schoolType } = this.state;
        creator.roles = [];
        
        this.setState({ message: "", loading: true });

        this.saveScheduleInDb(scheduleName, description, creator, schoolName, schoolType);
    }

    saveScheduleInDb = (scheduleName, description, creator, schoolName, schoolType) => {
        scheduleService.createSchedule(scheduleName, description, creator, schoolName, schoolType.toUpperCase())
        .then(result => {
            //add schedule to the current user
            let schedules = creator.schedules;
            schedules.push(result.data);

            //saves current schedule in the local storage
            scheduleService.saveCurrentSchedule(result.data);

            creator.schedules = schedules;

            //saves current user in the local storage
            authService.setCurrentUser(creator);

            this.setState({ newSchedule: result.data });

            this.props.history.push('/time-table-management');
        })
        .catch(error => {
            console.error(error);
        });
    }

    saveFromExistingSchedule = event => {
        const { 
            selectedSchedule, 
            schedules,
            scheduleName,
            description,
            schoolName,
            schoolType,
            creator } = this.state;

        const schedule = schedules[selectedSchedule];

        this.setState({ loading: true });

        this.saveScheduleInDb(scheduleName, description, creator, schoolName, schoolType);
        const newSchedule = scheduleService.getCurrentSchedule();

        //copy the information in the newSchedule
        this.copySubjects(newSchedule, schedule.id);
        this.copyTeachers(newSchedule, schedule.id);
        this.copyCabinets(newSchedule, schedule.id);
        this.copyCabinetCategories(newSchedule, schedule.id);
        this.copyTimeTables(newSchedule, schedule.id);

        this.setState({ loading: false });
            
        this.props.history.push('/time-table-management');
    }

    copyElements = (service, elements, schedule) => {
        elements.forEach(element => {
            element.schedule = schedule;
            service.create(element);
        });
    } 

    copySubjects = (schedule, oldScheduleId) => {
        subjectService.getAllSubjectsByScheduleId(oldScheduleId)
        .then(result => {
            this.copyElements(subjectService, result.data, schedule);
        })
        .catch(error => console.error(error));
    }

    copyTeachers(schedule, oldScheduleId) {
        teacherService.getAllTeachersByScheduleId(oldScheduleId)
        .then(result => {
            this.copyElements(teacherService, result.data, schedule);
        })
        .catch(error => console.error(error));
    }

    copyCabinets(schedule, oldScheduleId) {
        cabinetService.getAllCabinetsByScheduleId(oldScheduleId)
        .then(result => {
            this.copyElements(cabinetService, result.data, schedule);
        })
        .catch(error => console.error(error));
    }

    copyCabinetCategories(schedule, oldScheduleId) {
        cabinetCategoryService.getAllCabinetCategoriesByScheduleId(oldScheduleId)
        .then(result => {
            this.copyElements(cabinetCategoryService, result.data, schedule);
        })
        .catch(error => console.error(error));
    }

    copyTimeTables(schedule, oldScheduleId) {
        timeTableService.getAllTimeTablesByScheduleId(oldScheduleId)
        .then(result => {
            this.copyElements(timeTableService, result.data, schedule);
        })
        .catch(error => console.error(error));
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
                            <h1>Създайте своя график</h1>
                            <p>Въведете името на граика, малко описание за него
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
                                <MenuItem value={"middleSchool"}>Средно</MenuItem>0
                                <MenuItem value={"highSchool"}>Гимназиално</MenuItem>
                            </Select>
                            <FormHelperText>
                                Изберете типа на училището, за да се генерират определения брой випуски
                            </FormHelperText>
                        </FormGroup>

                        <FormGroup>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                className="btn-block"
                                disabled={isInvalid}>
                                    {this.state.loading &&
                                        <span className="spinner-border spinner-border-sm"></span>
                                    }
                                    <span>Създаване</span>
                            </Button>
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