import React, { Component } from 'react';
import { Container, Jumbotron, FormGroup, Alert } from 'react-bootstrap';
import scheduleService from "../../services/schedule/schedule.service";
import authService from '../../services/user-auth/auth.service';
import { Button } from '@material-ui/core';
import subjectService from '../../services/schedule/subject.service';
import teacherService from '../../services/schedule/teacher.service';
import cabinetService from '../../services/schedule/cabinet/cabinet.service';
import timeTableService from '../../services/schedule/time-management/time-table.service';
import teachingHourService from '../../services/schedule/teaching-hour.service';
import groupService from '../../services/schedule/group.service';
import { CustomSelect } from '../shared/custom-select.component';
import { TextInput } from '../shared/text-input.component';
import { CustomDialog } from '../shared/custom-dialog.component';
import { SaveButton } from '../shared/custom-buttons/save-button.component';

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
    }

    componentDidMount() {
        scheduleService.getSchedulesByCreatorId(this.state.creator.id)
        .then(result => this.setState({ schedules: result.data }))
        .catch(error => console.error(error));
    }

    saveSchedule = (copy) => {
        const { scheduleName, description, creator, schoolName, schoolTypes } = this.state;
        creator.roles = [];
        const onCreatedSchedule = copy ? this.copyExistingSchedule : this.redirectToNextPage;

        this.setState({ message: "", loading: true });

        this.saveScheduleInDb(
            scheduleName, 
            description, 
            creator, 
            schoolName, 
            schoolTypes, 
            onCreatedSchedule
        );
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

            const oldScheduleId = this.state.schedules.length !== 0 
                ? this.state.schedules[this.state.selectedSchedule].id
                : undefined;

            onCreatedSchedule(result.data, oldScheduleId);

            this.setState({ newSchedule: result.data });

        })
        .catch(error => console.error(error));
    }

    copyExistingSchedule = (newSchedule, oldScheduleId) => {
        subjectService.copy(oldScheduleId, newSchedule)
        .then(teacherService.copy(oldScheduleId, newSchedule))
        .then(cabinetService.copy(oldScheduleId, newSchedule))
        .then(groupService.copy(oldScheduleId, newSchedule))
        .then(timeTableService.copy(oldScheduleId, newSchedule))
        .then(teachingHourService.copy(oldScheduleId, newSchedule))
        .then(this.redirectToNextPage())
        .catch(error => console.error(error));
    }

    redirectToNextPage = () => this.props.history.push('/group-management');

    onChange = event => this.setState({ [event.target.name] : event.target.value });

    render() {
        const { show, schedules } = this.state;

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
                            и после продължетете с въвеждането на информацията за училището!</p>
                        </Container>
                    </Jumbotron>
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

                        <SaveButton
                            fullWidth={true}
                            text="Създаване"
                            onClick={this.saveSchedule.bind(this, false)}
                        />

                        <div className="myDisplayFlex myDefaultMarginTopBottom">
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
                    <CustomDialog 
                        show={show}
                        onClose={() => this.setState({ show: !show })}
                        title="Създаване от вече съществуващ график"
                        confirmFunction={this.saveSchedule.bind(this, true)}
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