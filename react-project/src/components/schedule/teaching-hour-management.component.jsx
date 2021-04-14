import React, { Component } from 'react';
import { Container, Jumbotron } from 'react-bootstrap';
import teachingHourService from '../../services/schedule/teaching-hour.service';
import subjectService from '../../services/schedule/subject.service';
import teacherService from '../../services/schedule/teacher.service';
import scheduleService from '../../services/schedule/schedule.service';
import cabinetService from '../../services/schedule/cabinet/cabinet.service';
import timeTableService from '../../services/schedule/time-management/time-table.service';
import TableList from '../shared/table.component';
import timeSlotService from '../../services/schedule/time-management/time-slot.service';
import TimeSlotSelect from '../shared/time-slot-select.component';
import { Checkbox } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import groupService from '../../services/schedule/group.service';
import { CustomDialog } from '../shared/custom-dialog.component';
import { CustomSelect } from '../shared/custom-select.component';
import { TextInput } from '../shared/text-input.component';
import { ButtonPagination } from '../shared/custom-buttons/button-pagination.component';
import { SaveButton } from '../shared/custom-buttons/save-button.component';
import { EditButton } from '../shared/custom-buttons/edit-button.component';

export default class ManageTeachingHours extends Component {
    constructor(props) {
        super(props);

        this.state = {
            teachingHours: [],
            subjects: [],
            groups: [],
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

        groupService.getAllTeachingGroups(this.state.schedule.id)
        .then(result => this.setState({ groups: result.data }))
        .then(this.fetchAllElemetnsByService(subjectService))
        .then(this.fetchAllElemetnsByService(teacherService))
        .then(this.fetchAllElemetnsByService(cabinetService))
        .then(this.fetchAllElemetnsByService(timeTableService))
    }

    fetchAllElemetnsByService = (service) => {
        return service.getAllByScheduleId(this.state.schedule.id)
        .then(result => {
            switch(service) {
                default: break;
                case subjectService:
                    this.setState({ subjects: result.data }); break;
                case teacherService:
                    this.setState({ teachers: result.data }); break;
                case cabinetService:
                    this.setState({ cabinets: result.data}); break;
                case timeTableService:
                    result.data.forEach(async timeTable => {
                        await timeSlotService.getTimeSlotsByTimeTableId(timeTable.id)
                        .then(slots => {
                            timeTable.slots = slots.data;
                            const timeTables = [...this.state.timeTables, timeTable];
                            this.setState({ timeTables: timeTables });
                            this.resetSelected(this.state.timeTables, true);
                        });
                    })
                    break;
            }
        })
        .catch(error => console.error(error));
    }

    resetSelected = (timeTables, type) => {
        timeTables.forEach(timeTable => timeTable.slots.forEach(res => res.selected = type));
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
            group: this.state.groups[this.state.selectedGroup],
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

    onChange = event => this.setState({ [event.target.name] : event.target.value });

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
                    {subjects[0] &&
                        <SaveButton
                            fullWidth={true}
                            text={"Създай нов хорараиум за предмет" + subjects[this.state.selectedSubject].name}
                            onClick={() => this.setState({ show: true })}
                        />}
                </Container>
                <Container>
                    {subjects[0] &&
                    <TableList 
                        type="teaching-hour" 
                        teachers={teachers} 
                        cabinets={cabinets}
                        groups={groups}
                        timeTables={timeTables}
                        elements={teachingHours.filter(
                            hour => hour.subject.id === subjects[this.state.selectedSubject].id
                        )}
                        service={teachingHourService}
                    />}
                    <ButtonPagination
                        backwardLink={"/time-table-management"}
                        forwardLink={"/schedule-dashboard"}
                    />
                </Container>
                <CustomDialog
                    show={show}
                    onClose={() => this.setState({ show: !show })}
                    title="Добавете нов час"
                    confirmFunction={this.saveTeachingHour}
                    confirmButtonText="Добавяне"
                    text={
                        <>
                            Създаване на хорариум за предмет <span className="scheduleName">
                            {subjects[this.state.selectedSubject] && subjects[this.state.selectedSubject].name}</span>.<br />
                            Въведете долупосочената информация 
                            (група, преподавател, колко часа в седмицата, опция за през седмица и учебна зала). <br />
                            Ако преподавателя има предпочитания за провеждането на часвоете, посочете ги в последната опция <br />
                            <span className="scheduleName"> ИЗБИРАНЕ НА ПРЕДПОЧИТАНИ ЧАСОВЕ</span>.
                        </>
                    }
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
                                label="Изберете преподавател"
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
                                label="Изберете учебна зала"
                                name="selectedCabinet"
                                value={this.state.selectedCabinet}
                                onChange={this.onChange}
                                elements={cabinets}
                            />

                            <EditButton
                                fullWidth={true}
                                onClick={() => this.setState({ hours: true, show: false })}
                                text="Избиране на предпочитани часове"
                            />
                        </>
                    }
                />
                <CustomDialog
                    show={hours}
                    onClose={() => this.setState({ hours: false, show: true })}
                    title="Изберете часове"
                    confirmFunction={() => this.setState({ hours: false, show: true })}
                    confirmButtonText="Запази"
                    disabled={disabled}
                    content={
                        <>
                            <CustomSelect
                                label="Изберете график"
                                name="selectedTimeTable"
                                value={this.state.selectedTimeTable}
                                onChange={this.onChange}
                                elements={timeTables}
                            />

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

                            {timeTables[this.state.selectedTimeTable] &&
                            <TimeSlotSelect
                                timeSlots={timeTables[this.state.selectedTimeTable].slots}
                                weekDaysTemplate={['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']}
                                ammount={ammount}
                                type="select"
                                changeTimeSlots={this.changeTimeSlots}
                            />}
                        </>
                    }
                />
            </>
        );
    }
}