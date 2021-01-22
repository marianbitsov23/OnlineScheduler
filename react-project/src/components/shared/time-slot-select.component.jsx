import React, { Component } from "react";
import { Table, Button, Row, Col } from 'react-bootstrap';

export default class TimeSlotSelect extends Component {
    constructor(props) {
        super(props);

        this.state = {
            weekDays: undefined,
            weekDaysTemplate: [],
            timeSlotTemplateMorning: [],
            timeSlotTemplateEvening: [],
            fetchedTimeSlots: this.props.timeSlots
        }
    }

    addTimeSlot(dayName) {
        const { timeSlotTemplateMorning, timeSlotTemplateEvening, weekDays } = this.props;
        const day = dayName[0];
        let timeSlotTemplate = [];

        this.props.time === "1" ? timeSlotTemplate = timeSlotTemplateMorning 
            : timeSlotTemplate = timeSlotTemplateEvening;
        
        let newTimeSlots = weekDays.filter(weekDay => weekDay.weekDay === day.toUpperCase());

        if(newTimeSlots.length < 7) {
            weekDays.push({
                weekDay: day.toUpperCase(),
                timeStart: timeSlotTemplate[newTimeSlots.length][0],
                timeEnd: timeSlotTemplate[newTimeSlots.length][1]
            });
        }

        localStorage.setItem("weekDays", JSON.stringify(Array.from(weekDays)));
        this.setState({ weekDays: weekDays });
    }

    deleteSlot = event => {
        event.preventDefault();

        let timeSlots = this.props.weekDays;

        timeSlots.splice(event.target.value, 1);

        localStorage.setItem("weekDays", JSON.stringify(Array.from(timeSlots)));
        this.setState({ weekDays: timeSlots });
    }

    
    addSlot = event => {
        event.preventDefault();
        const weekDay = [event.target.name];

        this.addTimeSlot(weekDay);
    }

    selectSlot = event => {
        event.preventDefault();

        const { timeSlots, changeTimeSlots } = this.props;

        timeSlots[event.target.value].selected = !timeSlots[event.target.value].selected;
        
        changeTimeSlots(timeSlots);
    }

    render() {
        const { weekDays, weekDaysTemplate } = this.props;

        let numberOfRows = [1, 2, 3, 4, 5, 6, 7];
        let timeSlots;

        this.props.timeSlots !== undefined 
            ? timeSlots = this.props.timeSlots
            : timeSlots = weekDays;

        if(timeSlots) {
            this.props.weekDaysTemplate.map(weekDayTemplate => {
                let index = 0;
                timeSlots.map(res => {
                    if(res.weekDay === weekDayTemplate.toUpperCase()) {
                        index++;
                        res.index = index;
                    }
                });
            });
        }

        return (
            <>
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
                        {numberOfRows.map(row => (
                            <tr key={row}>
                                {weekDaysTemplate.map((weekDayTemplate, index) => (
                                    <td key={index}>
                                        {timeSlots.map((timeSlot, index) => (
                                            <>
                                            {timeSlot.weekDay === weekDayTemplate.toUpperCase() &&
                                            timeSlot.index === row &&
                                                <Row key={index}>
                                                    <Col>{timeSlot.timeStart} - {timeSlot.timeEnd}</Col>
                                                    <Col>
                                                        {this.props.type !=='select' &&
                                                        <Button
                                                            size="sm"
                                                            value={timeSlots.indexOf(timeSlot)}
                                                            onClick={this.deleteSlot}
                                                            variant="outline-danger">
                                                            Изтриване</Button>
                                                        }
                                                        {!timeSlot.selected &&
                                                        this.props.type ==='select' &&
                                                            <Button
                                                                size="sm"
                                                                value={timeSlots.indexOf(timeSlot)}
                                                                onClick={this.selectSlot}
                                                                variant="outline-success">
                                                                Избери</Button>
                                                        }
                                                        {timeSlot.selected && 
                                                        this.props.type ==='select' &&
                                                        <Button
                                                            size="sm"
                                                            value={timeSlots.indexOf(timeSlot)}
                                                            onClick={this.selectSlot}
                                                            variant="outline-danger">
                                                            Премахване</Button>
                                                        }
                                                    </Col>
                                                </Row>
                                            }
                                            </>
                                        ))}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        <tr>
                            {this.props.type !=='select' && weekDaysTemplate && weekDaysTemplate.map((weekDayTemplate, index) => (
                                <td>
                                    <Button
                                    variant="outline-info"
                                    name={weekDayTemplate}
                                    disabled={this.props.edit}
                                    onClick={this.addSlot}>
                                        Добави час
                                    </Button>
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </Table>
            </>
        )
    }
}