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
import groupService from '../../services/schedule/group.service';
import lessonService from '../../services/schedule/lesson.service';
import { ConfirmButton } from '../shared/confirm-button.component';
import { CustomSelect } from '../shared/custom-select.component';
import { TextInput } from '../shared/text-input.component';
import { CustomDialog } from '../shared/custom-dialog.component';

export default class ManageSchedules extends Component {
    constructor(props) {
        super(props);

        this.state = {
            scheduleName: "",
            description: "",
            schoolName: "",
            schoolTypes: [{ name: 'Гимназия', type: 'highSchool'},
                          {name: 'Средно училище', type: 'middleSchool'}],
            selectedSchoolType: 0,
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
        const { scheduleName, description, creator, schoolName, schoolTypes } = this.state;
        creator.roles = [];
        
        this.setState({ message: "", loading: true });

        this.saveScheduleInDb(scheduleName, description, creator, schoolName, schoolTypes, this.redirectToNextPage);
    }

    saveScheduleInDb = async (scheduleName, description, creator, schoolName, schoolTypes, onCreatedSchedule) => {
        const schoolType = schoolTypes[this.state.selectedSchoolType].type;

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

        console.log(this.state.selectedSchoolType);

        return(
            <>
                <Container>
                    <Jumbotron fluid>
                        <Container>
                            <h1>Създайте своя график</h1>
                            <p>Въведете името на граика, кратко описание за него
                            и после продължетете с въвеждането на информацията за училището!</p>
                        </Container>
                    </Jumbotron>

                    <Form onSubmit={this.saveSchedule}>
                        <TextInput 
                            name="scheduleName"
                            value={this.state.scheduleName}
                            placeholder="Въедете името на графика"
                            helperText="Пример: ScheduleName_1_Morning"
                            label="Име на графика"
                            type="scheduleName"
                            shrink={true}
                            onChange={this.onChange}
                        />

                        <TextInput 
                            name="description"
                            value={this.state.description}
                            placeholder="Напишете кратко описание за графика"
                            shrink={true}
                            label="Описание"
                            type="description"
                            onChange={this.onChange}
                        />

                        <TextInput 
                            name="schoolName"
                            value={this.state.schoolName}
                            placeholder="Напишете името на училището, за което се отнася графика"
                            shrink={true}
                            label="Име на училище"
                            type="schoolName"
                            onChange={this.onChange}
                        />

                        <CustomSelect
                            label="Тип"
                            name="selectedSchoolType"
                            value={this.state.selectedSchoolType}
                            onChange={this.onChange}
                            elements={this.state.schoolTypes}
                        />

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
                    <CustomDialog 
                        show={show}
                        onClose={() => this.setState({ show: !show })}
                        title="Създаване от вече съществуващ график"
                        confirmFunction={this.saveFromExistingSchedule}
                        confirmButtonText="Създаване"
                        text=
                        {<>
                            Цялата информация от избрания графиk ще бъде копирана.
                            Без името и описанието.
                        </>}
                        content=
                        {<>
                            <CustomSelect
                                name="selectedSchedule"
                                value={this.state.selectedSchedule}
                                onChange={this.onChange}
                                elements={schedules}
                            />

                            <TextInput 
                                name="scheduleName"
                                value={this.state.scheduleName}
                                label="Въведете името на графика"
                                type="scheduleName"
                                onChange={this.onChange}
                            />

                            <TextInput
                                name="description"
                                label="Описание за гарфика"
                                type="description"
                                onChange={this.onChange}
                                value={this.state.description}
                            />
                        </>}
                    />                  
                </Container>
            </>
        );
    }
}