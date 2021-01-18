import React, { Component } from "react";
import { Table, Button, Row, Col } from 'react-bootstrap';
import timeSlotService from '../../services/schedule/timeManegment/time-slot.service';

export default class TimeSlotSelect extends Component {
    constructor(props) {
        super(props);

        this.state = {
            weekDays: undefined,
            weekDaysTemplate: [],
            timeSlotTemplateMorning: [],
            timeSlotTemplateEvening: [],
            timeSlots: undefined
        }
    }


    componentDidMount() {
        if(this.props.type === 'select') {
            this.fetchTimeSlots();
        }
    }

    addTimeSlot(dayName) {
        const { timeSlotTemplateMorning, timeSlotTemplateEvening, weekDays } = this.props;
        const day = dayName[0];
        let value = weekDays.get(day);
        let timeSlotTemplate = [];

        this.props.time === "1" ? timeSlotTemplate = timeSlotTemplateMorning 
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

        localStorage.setItem("weekDays", JSON.stringify(Array.from(weekDays.entries())));
        this.setState({ weekDays: weekDays });
    }

    deleteSlot = event => {
        event.preventDefault();

        let weekDays = this.props.weekDays;
        const dayName = [event.target.name];
        let timeSlots = weekDays.get(dayName[0]);

        timeSlots.splice(timeSlots.indexOf(event.target.value), 1);

        localStorage.setItem("weekDays", JSON.stringify(Array.from(weekDays.entries())));
        this.setState({ weekDays: weekDays });
    }

    
    addSlot = event => {
        event.preventDefault();
        const weekDay = [event.target.name];

        this.addTimeSlot(weekDay);
    }
    

    fetchTimeSlots() {
        timeSlotService.getTimeSlotByTimeTableId(this.props.timeTable.id)
        .then(result => {
            this.setState({ timeSlots: result.data})
        })
        .catch(error => {
            console.error(error);
        });
    }

    render() {
        const { weekDays, weekDaysTemplate } = this.props;

        let mondaySlots = [];
        let tuesdaySlots = [];
        let wednesdaySlots = []; 
        let thursdaySlots = []; 
        let fridaySlots = [];

        let timeSlots = this.state.timeSlots;

        if(this.props.type === 'select' && timeSlots) {
            timeSlots.map(res => {
                switch(res.weekDay) {
                    case 'MONDAY': 
                        mondaySlots.push([res.timeStart], [res.timeEnd]);
                        break;
                    case 'TUESDAY': 
                        tuesdaySlots.push([res.timeStart], [res.timeEnd]);
                        break;
                    case 'WEDNESDAY': 
                        wednesdaySlots.push([res.timeStart], [res.timeEnd]);
                        break;
                    case 'THURSDAY': 
                        thursdaySlots.push([res.timeStart], [res.timeEnd]);
                        break;
                    case 'FRIDAY': 
                        fridaySlots.push([res.timeStart], [res.timeEnd]);
                        break;
                }
            })
        } else if(weekDays) {
            mondaySlots = weekDays.get('Monday');
            tuesdaySlots = weekDays.get('Tuesday');
            wednesdaySlots = weekDays.get('Wednesday');
            thursdaySlots = weekDays.get('Thursday');
            fridaySlots = weekDays.get('Friday');
        }

        console.log(timeSlots);

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
                        <tr>
                            <td>
                                {mondaySlots && mondaySlots.map(mondaySlot => (
                                    <>
                                        {mondaySlot && 
                                        <Row>
                                            <Col>
                                                {mondaySlot[0]} - {mondaySlot[1]}
                                            </Col>
                                            {this.props.type !=='select' &&
                                            <Col>
                                                <Button
                                                    size="sm"
                                                    name="Monday"
                                                    value={mondaySlot}
                                                    onClick={this.deleteSlot}
                                                    variant="outline-danger">
                                                    Премахни</Button>
                                            </Col>}
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
                                            {this.props.type !=='select' &&
                                            <Col>
                                                <Button
                                                    size="sm"
                                                    name="Tuesday"
                                                    onClick={this.deleteSlot}
                                                    variant="outline-danger">
                                                    Премахни</Button>
                                            </Col>}
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
                                            {this.props.type !=='select' &&
                                            <Col>
                                                <Button
                                                    size="sm"
                                                    name="Wednesday"
                                                    onClick={this.deleteSlot}
                                                    variant="outline-danger">
                                                    Премахни</Button>
                                            </Col>}
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
                                            {this.props.type !=='select' &&
                                            <Col>
                                                <Button
                                                    size="sm"
                                                    name="Thursday"
                                                    onClick={this.deleteSlot}
                                                    variant="outline-danger">
                                                    Премахни</Button>
                                            </Col>}
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
                                            {this.props.type !=='select' &&
                                            <Col>
                                                <Button
                                                    size="sm"
                                                    name="Friday"
                                                    onClick={this.deleteSlot}
                                                    variant="outline-danger">
                                                    Премахни</Button>
                                            </Col>}
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