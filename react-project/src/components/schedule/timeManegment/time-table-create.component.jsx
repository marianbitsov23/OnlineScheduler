import React, { Component } from 'react';

import { Container, Table, Button, Jumbotron, FormGroup, Row, Col } from 'react-bootstrap';
import FormBootstrap from 'react-bootstrap/Form';
import Input from "react-validation/build/input";
import Form from "react-validation/build/form";
import timeTableService from '../../../services/schedule/timeManegment/time-table.service';
import timeSlotService from '../../../services/schedule/timeManegment/time-slot.service';
import scheduleService from '../../../services/schedule/schedule.service';

export default class CreateTimeTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timeTableName: "",
            weekDays: undefined,
            weekDaysTemplate: [],
            timeSlotTemplateMorning: [],
            timeSlotTemplateEvening: [],
            allSlots: [],
            edit: true,
            time: "1"
        };

        this.addSlot.bind(this);
        this.deleteSlot.bind(this);
        this.onChange.bind(this);
        this.saveTimeTable.bind(this);
    }

    componentDidMount() {
        this.initWeekDays();
    }

    onChange = event => this.setState({ [event.target.name] : event.target.value });

    initWeekDays() {
        let weekDays = new Map();
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

        for(let i = 0; i < 5; i ++) {
            weekDays.set(weekDaysTemplate[i], []);
        }
        
        this.setState({ 
            weekDays : weekDays,
            weekDaysTemplate : weekDaysTemplate,
            timeSlotTemplateMorning : timeSlotTemplateMorning,
            timeSlotTemplateEvening: timeSlotTemplateEvening
        });
    }

    addTimeSlot(dayName) {
        const { timeSlotTemplateMorning, timeSlotTemplateEvening, weekDays } = this.state;
        const day = dayName[0];
        let value = weekDays.get(day);
        let timeSlotTemplate = [];

        this.state.time === "1" ? timeSlotTemplate = timeSlotTemplateMorning 
            : timeSlotTemplate = timeSlotTemplateEvening;
        
        Object.size = function(obj) {
            let size = 0, key;
            for(key in obj) {
                if(obj.hasOwnProperty(key)) size++;
            }
            return size;
        }

        let size = Object.size(value);

        if(size < 7) {
            let newTimeList = weekDays.get(day);
            newTimeList.push(timeSlotTemplate[size]);
            weekDays.set(day, newTimeList);
        }

        this.setState({ weekDays : weekDays });
    }

    async saveAllTimeSlotsByDayInDb(dayName, tableId) {
        const { weekDays } = this.state;
        let daySlots = weekDays.get(dayName)

        for(let i = 0; i < daySlots.length; i++) {
            await timeSlotService.createTimeSlot(dayName.toUpperCase(), daySlots[i][0], daySlots[i][1], tableId)
        }
    }

    async saveAllSlotsInDb (tableId) {
        let days = this.state.weekDaysTemplate;

        for(let i = 0; i < 5; i++) {
            await this.saveAllTimeSlotsByDayInDb(days[i], tableId);
        }
    }

    addSlot = event => {
        event.preventDefault();
        const weekDay = [event.target.name];

        this.addTimeSlot(weekDay);
    }

    saveTimeTable = event => {
        event.preventDefault();

        const schedule = scheduleService.getCurrentSchedule();
        const { allSlots, timeTableName } = this.state;

        console.log(allSlots);

        timeTableService.createTimeTable(schedule, timeTableName)
        .then(result => {
            this.saveAllSlotsInDb(result.data.id)
            .then(() => {
                console.log("success");
            })
        });
    }

    deleteSlot = event => {
        event.preventDefault();

        let weekDays = this.state.weekDays;
        const dayName = [event.target.name];
        let timeSlots = weekDays.get(dayName[0]);

        timeSlots.splice(timeSlots.indexOf(event.target.value), 1);

        this.setState({ weekDays: weekDays });
    }

    render() {

        console.log(this.state.time);

        const { timeTableName, weekDays, weekDaysTemplate, edit } = this.state;

        const isInvalid = timeTableName === "";

        let mondaySlots = undefined;
        let tuesdaySlots = undefined;
        let wednesdaySlots = undefined; 
        let thursdaySlots = undefined; 
        let fridaySlots = undefined;

        if(weekDays) {
            mondaySlots = weekDays.get('Monday');
            tuesdaySlots = weekDays.get('Tuesday');
            wednesdaySlots = weekDays.get('Wednesday');
            thursdaySlots = weekDays.get('Thursday');
            fridaySlots = weekDays.get('Friday');
        }

        return(
            <>
                <Container>
                    <Jumbotron>
                        {!edit &&
                            <>
                                <h1>{timeTableName}</h1>

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
                        <Form
                            onSubmit={() => this.setState({ edit : false,  })}
                            ref={c => {
                                this.form = c;
                            }}
                        >
                            <FormGroup>
                                <FormBootstrap.Label htmlFor="timeTableName">Име на времевата таблица</FormBootstrap.Label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    name="timeTableName"
                                    value={this.state.timeTableName}
                                    onChange={this.onChange}
                                />
                            </FormGroup>

                            <FormGroup controlId="exampleForm.ControlSelect1">
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
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Понеделник</th>
                                <th>Вторник</th>
                                <th>Сряда</th>
                                <th>Четвъртък</th>
                                <th>Петък</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    {mondaySlots && mondaySlots.map(mondaySlot => (
                                        <>
                                            {mondaySlot && 
                                            <Row>
                                                <Col>
                                                    {mondaySlot[0]} - {mondaySlot[1]}
                                                </Col>
                                                <Col>
                                                    <Button
                                                        size="sm"
                                                        name="Monday"
                                                        value={mondaySlot}
                                                        onClick={this.deleteSlot}
                                                        variant="outline-danger">
                                                        Премахни</Button>
                                                </Col>
                                            </Row>} 
                                        </>
                                    ))}
                                </td>     
                                <td>
                                    {tuesdaySlots && tuesdaySlots.map(tuesdaySlot => (
                                        <>
                                            {tuesdaySlot &&
                                            <Row>
                                                <Col>
                                                    {tuesdaySlot[0]} - {tuesdaySlot[1]}
                                                </Col>
                                                <Col>
                                                    <Button
                                                        size="sm"
                                                        name="Tuesday"
                                                        onClick={this.deleteSlot}
                                                        variant="outline-danger">
                                                        Премахни</Button>
                                                </Col>
                                            </Row>} 
                                        </>
                                    ))}
                                </td> 
                                <td>
                                    {wednesdaySlots && wednesdaySlots.map(wednesdaySlot => (
                                        <>
                                            {wednesdaySlot &&
                                            <Row>
                                                <Col>
                                                    {wednesdaySlot[0]} - {wednesdaySlot[1]}
                                                </Col>
                                                <Col>
                                                    <Button
                                                        size="sm"
                                                        name="Wednesday"
                                                        onClick={this.deleteSlot}
                                                        variant="outline-danger">
                                                        Премахни</Button>
                                                </Col>
                                            </Row>} 
                                        </>
                                    ))}
                                </td> 
                                <td>
                                    {thursdaySlots && thursdaySlots.map(thursdaySlot => (
                                        <>
                                            {thursdaySlot &&
                                            <Row>
                                                <Col>
                                                    {thursdaySlot[0]} - {thursdaySlot[1]}
                                                </Col>
                                                <Col>
                                                    <Button
                                                        size="sm"
                                                        name="Thursday"
                                                        onClick={this.deleteSlot}
                                                        variant="outline-danger">
                                                        Премахни</Button>
                                                </Col>
                                            </Row>} 
                                        </>
                                    ))}
                                </td>
                                <td>
                                    {fridaySlots && fridaySlots.map(fridaySlot => (
                                        <>
                                            {fridaySlot &&
                                            <Row>
                                                <Col>
                                                    {fridaySlot[0]} - {fridaySlot[1]}
                                                </Col>
                                                <Col>
                                                    <Button
                                                        size="sm"
                                                        name="Friday"
                                                        onClick={this.deleteSlot}
                                                        variant="outline-danger">
                                                        Премахни</Button>
                                                </Col>
                                            </Row>} 
                                        </>
                                    ))}
                                </td> 
                            </tr>
                            <tr>
                                {weekDaysTemplate && weekDaysTemplate.map(weekDayTemplate => (
                                    <td>
                                        <Button
                                        variant="outline-info"
                                        name={weekDayTemplate}
                                        disabled={this.state.edit}
                                        onClick={this.addSlot}>
                                            Добави час
                                        </Button>
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </Table>

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
            </>
        )
    }
}