import React, { Component } from 'react';
import TableList from '../../shared/table.component';
import { Container, Button, Jumbotron, FormGroup, } from 'react-bootstrap';
import FormBootstrap from 'react-bootstrap/Form';
import Input from "react-validation/build/input";
import Form from "react-validation/build/form";
import timeTableService from '../../../services/schedule/time-management/time-table.service';
import timeSlotService from '../../../services/schedule/time-management/time-slot.service';
import scheduleService from '../../../services/schedule/schedule.service';
import { Link } from 'react-router-dom';
import TimeSlotSelect from '../../shared/time-slot-select.component';

export default class ManageTimeTables extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            weekDays: undefined,
            weekDaysTemplate: [],
            timeSlotTemplateMorning: [],
            timeSlotTemplateEvening: [],
            loading: false,
            edit: true,
            time: "1",
            timeTables: [],
            schedule: scheduleService.getCurrentSchedule()
        };

        this.onChange.bind(this);
        this.saveTimeTable.bind(this);
    }

    componentDidMount() {
        this.initWeekDays();

        timeTableService.getAllByScheduleId(this.state.schedule.id)
        .then(timeTables => {
            this.setState({ timeTables: timeTables.data });
        })
        .catch(error => console.error(error));
    }

    initWeekDays() {
        let weekDays = [];
        let weekDaysTemplate = [];

        const timeSlotTemplateMorning = [
            ["8:00", "8:40"],
            ["8:50", "9:30"],
            ["9:40", "10:20"],
            ["10:50", "11:40"],
            ["11:50", "12:30"],
            ["12:40", "13:20"],
            ["13:30", "14:10"]
        ];

        const timeSlotTemplateEvening = [
            ["13:00", "13:40"],
            ["13:50", "14:30"],
            ["14:40", "15:20"],
            ["15:50", "16:40"],
            ["16:50", "17:30"],
            ["17:40", "18:20"],
            ["18:30", "19:10"]
        ];

        weekDaysTemplate.push('Monday');
        weekDaysTemplate.push('Tuesday');
        weekDaysTemplate.push('Wednesday');
        weekDaysTemplate.push('Thursday');
        weekDaysTemplate.push('Friday');
        
        this.setState({ 
            weekDays : weekDays,
            weekDaysTemplate : weekDaysTemplate,
            timeSlotTemplateMorning : timeSlotTemplateMorning,
            timeSlotTemplateEvening: timeSlotTemplateEvening
        });
    }

    onChange = event => this.setState({ [event.target.name] : event.target.value });

    async saveAllTimeSlotsByDayInDb(tableId) {
        const { weekDays } = this.state;

        for(let i = 0; i < weekDays.length; i++) {
            await timeSlotService.createTimeSlot(weekDays[i].weekDay, weekDays[i].timeStart, weekDays[i].timeEnd, tableId);
        }
    }

    async saveAllSlotsInDb (tableId) {
        await this.saveAllTimeSlotsByDayInDb(tableId);
    }

    saveTimeTable = event => {
        event.preventDefault();

        const schedule = scheduleService.getCurrentSchedule();
        const { name } = this.state;

        this.setState({ loading: true });

        timeTableService.create({schedule, name})
        .then(result => {
            this.saveAllSlotsInDb(result.data.id)
            .then(() => {
                this.initWeekDays();
                this.state.timeTables.push(result.data)
                this.setState({ edit: true, name: "", loading: false });
            })
        });
    }

    setSlots = (weekDays) => {
        this.setState({ weekDays });
    }

    render() {
        const { name, weekDays, weekDaysTemplate, edit, timeTables } = this.state;

        const isInvalid = name === "";

        return(
            <>
                <Container>
                    <Jumbotron>
                        {!edit &&
                            <>
                                <h1>{name}</h1>

                                <Button
                                variant="outline-secondary"
                                onClick={() => {
                                    this.setState({ edit: true }); 
                                    this.initWeekDays();
                                }}>
                                    Редактирай
                                </Button>
                            </>
                        }

                        {edit &&
                        <Form onSubmit={() => this.setState({ edit : false,  })}>
                            <FormGroup>
                                <FormBootstrap.Label htmlFor="timeTableName">Име на времевата таблица</FormBootstrap.Label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    value={this.state.name}
                                    onChange={this.onChange}
                                />
                            </FormGroup>

                            <FormGroup>
                                <FormBootstrap.Label>Изберете смяна</FormBootstrap.Label>
                                <FormBootstrap.Control as="select" name="time" value={this.state.time} onChange={this.onChange}>
                                    <option value="1">Първа смяна</option>
                                    <option value="2">Втора смяна</option>
                                </FormBootstrap.Control>
                            </FormGroup>

                            <FormGroup>
                                    <Button
                                        type="submit"
                                        className="btn-block"
                                        disabled={isInvalid}>
                                            {this.state.loading &&
                                                <span className="spinner-border spinner-border-sm"></span>
                                            }
                                            <span>Запази</span>
                                        </Button>
                                </FormGroup>
                        </Form>}
                    </Jumbotron>
                    <TimeSlotSelect 
                        time={this.state.time}
                        edit={this.state.edit}
                        weekDays={weekDays}
                        weekDaysTemplate={weekDaysTemplate}
                        timeSlotTemplateEvening={this.state.timeSlotTemplateEvening}
                        timeSlotTemplateMorning={this.state.timeSlotTemplateMorning}
                        setSlots={this.setSlots}
                    />
                    <Button
                        variant="success"
                        className="btn-block"
                        onClick={this.saveTimeTable}
                        disabled={edit}>
                            {this.state.loading &&
                                <span className="spinner-border spinner-border-sm"></span>
                            }
                            <span>Създай Времева Таблица</span>
                    </Button>
                </Container>
                <Container>
                    <TableList type="time-table" elements={timeTables} service={timeTableService} />
                </Container>
                <Link to={"/subject-management"}>
                    <Button className="btn-block">
                        Напред
                    </Button>
                </Link>
            </>
        )
    }
}