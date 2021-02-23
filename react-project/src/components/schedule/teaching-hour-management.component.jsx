import React, { Component } from 'react';
import { Container, Button, Jumbotron, FormGroup, Modal } from 'react-bootstrap';
import teachingHourService from '../../services/schedule/teaching-hour.service';
import subjectService from '../../services/schedule/subject.service';
import teacherService from '../../services/schedule/teacher.service';
import { Link } from 'react-router-dom';
import scheduleService from '../../services/schedule/schedule.service';
import cabinetService from '../../services/schedule/cabinet/cabinet.service';
import timeTableService from '../../services/schedule/time-management/time-table.service';
import FormBootstrap from 'react-bootstrap/Form';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import TableList from '../shared/table.component';
import timeSlotService from '../../services/schedule/time-management/time-slot.service';
import TimeSlotSelect from '../shared/time-slot-select.component';
import { Checkbox } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import groupService from '../../services/schedule/group.service';
import { CustomDialog } from '../shared/custom-dialog.component';
import { CustomSelect } from '../shared/custom-select.component';
import { TextInput } from '../shared/text-input.component';

export default class ManageTeachingHours extends Component {
    constructor(props) {
        super(props);

        this.state = {
            teachingHours: [],
            subjects: [],
            teachers: [],
            cabinets: [],
            timeTables: [],
            show: false,
            hours: false,
            loading: false,
            selectedSubject: 0,
            selectedTeacher: 0,
            selectedCabinet: 0,
            selectedTimeTable: 0,
            selectedGroup: 0,
            fetchedTimeSlots: [],
            hoursPerWeek: 1,
            overAWeek: false,
            ammount: 0,
            checkAll: false,
            schedule: scheduleService.getCurrentSchedule()
        };
    }

    async componentDidMount() {
        teachingHourService.getAllByScheduleId(this.state.schedule.id)
        .then(result => {
            this.setState({ teachingHours: result.data });
        })
        .catch(error => console.error(error));

        await this.fetchAllGroups();

        await this.fetchAllSubjects();

        await this.fetchAllTeachers();

        await this.fetchAllCabinets();

        await this.fetchAllTimeTables();
    }

    async fetchAllGroups() {
        groupService.getAllByScheduleId(this.state.schedule.id)
        .then(result => {
            this.setState({ groups: result.data });
        })
        .catch(error => console.error(error));
    }

    async fetchAllSubjects() {
        subjectService.getAllByScheduleId(this.state.schedule.id)
        .then(result => {
            this.setState({ subjects: result.data });
        })
        .catch(error => console.error(error));
    }

    async fetchAllTeachers() {
        teacherService.getAllByScheduleId(this.state.schedule.id)
        .then(result => {
            this.setState({ teachers: result.data });
        })
        .catch(error => console.error(error));
    }    

    async fetchAllCabinets() {
        cabinetService.getAllByScheduleId(this.state.schedule.id)
        .then(result => {
            this.setState({ cabinets: result.data });
        })
        .catch(error => console.error(error));
    }

    async fetchAllTimeTables() {
        timeTableService.getAllByScheduleId(this.state.schedule.id)
        .then(result => {
            result.data.forEach(timeTable => {
                timeSlotService.getTimeSlotsByTimeTableId(timeTable.id)
                .then(slots => {
                    timeTable.slots = slots.data;
                });
            });
            this.setState({ timeTables: result.data });
        })
        .then(() => {
            this.resetSelected(this.state.timeTables, false);
        })
        .catch(error => console.error(error));
    }

    resetSelected = (timeTables, type) => {
        timeTables.forEach(timeTable => {
            timeTable.slots.forEach(res => { res.selected = type; })
        });
        let ammount;
        type === true 
            ? ammount = timeTables[this.state.selectedTimeTable].length 
            : ammount = 0;
        this.setState({ timeTables: timeTables, checkAll: type, ammount: ammount });
    }

    saveTeachingHour = event => {
        event.preventDefault();

        this.setState({ loading: true });

        const timeSlots = this.state.timeTables[this.state.selectedTimeTable].slots
        .filter(slot => slot.selected);
        
        teachingHourService.create({
            subject: this.state.subjects[this.state.selectedSubject],
            teacher: this.state.teachers[this.state.selectedTeacher],
            hoursPerWeek: this.state.hoursPerWeek,
            overAWeek: this.state.overAWeek,
            cabinet: this.state.cabinets[this.state.selectedCabinet],
            timeSlots: timeSlots,
            schedule: this.state.schedule
        })
        .then(result => {
            this.state.teachingHours.push(result.data);
            this.setState({ show: false, loading: false, ammount: 0, checkAll: false });
            this.resetSelected(this.state.timeTables, false);
        })
        .catch(error => console.error(error));
    }

    onChange = event => {
        event.preventDefault();
        this.setState({ [event.target.name] : event.target.value });
    }

    changeTimeSlots = (timeSlots, ammount) => {
        const { timeTables } = this.state;
        timeTables[this.state.selectedTimeTable].slots = timeSlots;
        this.setState({ timeTables, ammount });
    }

    handleCheck = event => {
        if([event.target.name][0] === 'checkAll') {
            this.resetSelected(this.state.timeTables, event.target.checked);
        }
        this.setState({ [event.target.name]: event.target.checked });
    }

    render() {
        const { 
            teachingHours, 
            subjects, 
            teachers, 
            cabinets, 
            timeTables,
            groups,
            hours,
            hoursPerWeek,
            ammount,
            show } = this.state;

        const disabled = 
            ammount < hoursPerWeek;

        return(
            <>
                <Container>
                    <Jumbotron fluid>
                        <Container>
                            <h1>Хорариум</h1>
                            <p>Въведете групата за която се отнася, преподавател, 
                            предмет, колко часа в седмицата ще се преподава и в кой кабинет!</p>
                        </Container>
                    </Jumbotron>
                </Container>
                <Container>
                    <CustomSelect
                        label="Изберете предмет"
                        name="selectedSubject"
                        value={this.state.selectedSubject}
                        onChange={this.onChange}
                        elements={subjects}
                    />

                    <Button
                        className="btn-block myDefaultMarginTopBottom"
                        variant="success"
                        onClick={() => this.setState({ show: true })}
                    >
                        Създай нов хорараиум за предмет ({subjects[0] && subjects[this.state.selectedSubject].name})
                    </Button>
                </Container>
                <Container>
                    {subjects[0] &&
                    <TableList 
                        type="teaching-hour" 
                        teachers={teachers} 
                        cabinets={cabinets}
                        timeTables={timeTables}
                        elements={teachingHours.filter(
                            hour => hour.subject.id === subjects[this.state.selectedSubject].id
                        )}
                        service={teachingHourService}
                    />}
                </Container>
                <CustomDialog
                    show={show}
                    onClose={() => this.setState({ show: !show })}
                    title="Добавете нов час"
                    confirmFunction={this.saveTeachingHour}
                    confirmButtonText="Добавяне"
                    content={
                        <>
                            <CustomSelect
                                label="Изберете група"
                                name="selectedGroup"
                                value={this.state.selectedGroup}
                                onChange={this.onChange}
                                elements={groups}
                            />

                            <CustomSelect
                                label="Изберете учител"
                                name="selectedTeacher"
                                value={this.state.selectedTeacher}
                                onChange={this.onChange}
                                elements={teachers}
                            />

                            <TextInput
                                label="Час/седмица"
                                name="hoursPerWeek"
                                type="number"
                                max="35"
                                value={this.state.hoursPerWeek}
                                onChange={this.onChange}
                            />

                            <FormControlLabel
                                control={
                                <Checkbox 
                                    checked={this.state.overAWeek} 
                                    onChange={this.handleCheck} 
                                    name="overAWeek" 
                                    color="primary"
                                />}
                                label="През седмица"
                            />

                            <CustomSelect
                                label="Изберете кабинет"
                                name="selectedCabinet"
                                value={this.state.selectedCabinet}
                                onChange={this.onChange}
                                elements={cabinets}
                            />

                            <Button
                                variant="outline-info"
                                onClick={() => this.setState({ hours: true, show: false })}
                            >
                                Изберете часове
                            </Button>
                        </>
                    }
                />
                <Modal
                show={hours}
                size="lg"
                onHide={() => this.setState({ hours: !hours })}
                centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Изберете часове</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FormGroup>
                            <FormBootstrap.Label>Изберете график</FormBootstrap.Label>
                            <FormBootstrap.Control as="select" name="selectedTimeTable" value={this.state.selectedTimeTable} onChange={this.onChange}>
                                {timeTables && timeTables.map((timeTable, index) => (
                                    <option key={timeTable.id} value={index}>{timeTable.name}</option>
                                ))}
                            </FormBootstrap.Control>
                        </FormGroup>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                <Checkbox 
                                    checked={this.state.checkAll} 
                                    onChange={this.handleCheck} 
                                    name="checkAll" 
                                    color="primary"
                                />}
                                label="Избери всички"
                            />
                        </FormGroup>
                        {timeTables[this.state.selectedTimeTable] &&
                        <TimeSlotSelect
                            timeSlots={timeTables[this.state.selectedTimeTable].slots}
                            weekDaysTemplate={['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']}
                            ammount={this.state.ammount}
                            type="select"
                            changeTimeSlots={this.changeTimeSlots}
                        />}
                        <Button
                            variant="success"
                            className="btn-block"
                            onClick={() => this.setState({ hours: false, show: true })}
                        >   
                            Запази
                    </Button>
                    </Modal.Body>
                </Modal>
                <Link to={"/schedule-dashboard"}>
                    <Button
                        className="btn-block"
                    >
                        Напред
                    </Button>
                </Link>
            </>
        );
    }
}