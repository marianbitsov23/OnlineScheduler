import React, { Component } from 'react';

import { Container, Table, Button, Jumbotron, FormGroup } from 'react-bootstrap';
import FormBootstrap from 'react-bootstrap/Form';
import Input from "react-validation/build/input";
import Form from "react-validation/build/form";
import timeTableService from '../../../services/schedule/timeManegment/time-table.service';
import authService from '../../../services/user-auth/auth.service';

export default class CreateTimeTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timeTableName: "",
            slots: [],
            weekDays: undefined,
            weekDaysTemplate: [],
            timeSlotTemplate: [],
            edit: true
        };

        this.saveSlot.bind(this);
        this.deleteSlot.bind(this);
        this.onChange.bind(this);
        this.saveTableName.bind(this);
    }

    componentDidMount() {
        this.initWeekDays();

        /*
        timeTableService.createTimeTable(null, "", [])
        .then(() => {

        })
        .catch(error => {
            console.error(error);
        });
        */
    }

    onChange = event => this.setState({ [event.target.name] : event.target.value });

    initWeekDays() {
        let weekDays = new Map();
        let weekDaysTemplate = [];

        const timeSlotTemplate = [
            ["8:00", "8:40"],
            ["8:50", "9:30"],
            ["9:40", "10:20"],
            ["10:50", "11:40"],
            ["11:50", "12:30"],
            ["12:40", "13:20"],
            ["13:30", "14:10"]
        ];

        weekDaysTemplate.push('Monday');
        weekDaysTemplate.push('Tuesday');
        weekDaysTemplate.push('Wednesday');
        weekDaysTemplate.push('Thursday');
        weekDaysTemplate.push('Friday');


        weekDays.set('Monday', []);
        weekDays.set('Tuesday', []);
        weekDays.set('Wednesday', []);
        weekDays.set('Thursday', []);
        weekDays.set('Friday', []);

        this.setState({ 
            weekDays : weekDays,
            weekDaysTemplate : weekDaysTemplate,
            timeSlotTemplate : timeSlotTemplate
        });
    }

    addTimeSlot(weekDay) {
        const { timeSlotTemplate, weekDays } = this.state;

        const day = weekDay[0];

        let value = weekDays.get(day);
        
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

    saveSlot = event => {
        event.preventDefault();

        const weekDay = [event.target.name];

        this.addTimeSlot(weekDay);
    }

    saveTableName = event => {
        event.preventDefault();

        this.setState({ edit : false });
    }

    deleteSlot = event => {
        event.preventDefault();

        let weekDays = this.state.weekDays;

        const weekDay = [event.target.name];

        let timeSlots = weekDays.get(weekDay[0]);

        timeSlots.splice(timeSlots.indexOf(event.target.value), 1);

        this.setState({ weekDays: weekDays });
    }

    render() {

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
        
        let slots = [
            {mondaySlots: mondaySlots},
            {tuesdaySlots: tuesdaySlots},
            {wednesdaySlots: wednesdaySlots},
            {thursdaySlots: thursdaySlots},
            {fridaySlots: fridaySlots}
        ];

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

                                    }}
                                >
                                        Edit Name
                                </Button>
                            </>
                        }

                        {edit &&
                        <Form
                            onSubmit={this.saveTableName}
                            ref={c => {
                                this.form = c;
                            }}
                        >
                            <FormGroup>
                                <FormBootstrap.Label htmlFor="timeTableName">Time table name</FormBootstrap.Label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    name="timeTableName"
                                    value={this.state.timeTableName}
                                    onChange={this.onChange}
                                />
                            </FormGroup>

                            <FormGroup>
                                    <Button
                                        type="submit"
                                        variant="success"
                                        className="btn-block"
                                        disabled={isInvalid}>
                                            {this.state.loading &&
                                                <span className="spinner-border spinner-border-sm"></span>
                                            }
                                            <span>Save table name</span>
                                        </Button>
                                </FormGroup>
                        </Form>}
                    </Jumbotron>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Monday</th>
                                <th>Tuesday</th>
                                <th>Wednesday</th>
                                <th>Thursday</th>
                                <th>Friday</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    {mondaySlots && mondaySlots.map(mondaySlot => (
                                        <>
                                            {mondaySlot && <p>
                                                {mondaySlot[0]} - {mondaySlot[1]}
                                                <Button
                                                    sime="sm"
                                                    name="Monday"
                                                    value={mondaySlot}
                                                    onClick={this.deleteSlot}
                                                    variant="outline-danger">
                                                    Remove</Button>
                                                </p>} 
                                        </>
                                    ))}
                                </td>     
                                <td>
                                    {tuesdaySlots && tuesdaySlots.map(tuesdaySlot => (
                                        <>
                                            {tuesdaySlot && <p>
                                                {tuesdaySlot[0]} - {tuesdaySlot[1]}
                                                <Button
                                                    sime="sm"
                                                    name="Tuesday"
                                                    onClick={this.deleteSlot}
                                                    variant="outline-danger">
                                                    Remove</Button>
                                            </p>} 
                                        </>
                                    ))}
                                </td> 
                                <td>
                                    {wednesdaySlots && wednesdaySlots.map(wednesdaySlot => (
                                        <>
                                            {wednesdaySlot && <p>
                                                {wednesdaySlot[0]} - {wednesdaySlot[1]}
                                                <Button
                                                    sime="sm"
                                                    name="Wednesday"
                                                    onClick={this.deleteSlot}
                                                    variant="outline-danger">
                                                    Remove</Button>
                                                </p>} 
                                        </>
                                    ))}
                                </td> 
                                <td>
                                    {thursdaySlots && thursdaySlots.map(thursdaySlot => (
                                        <>
                                            {thursdaySlot && <p>
                                                {thursdaySlot[0]} - {thursdaySlot[1]}
                                                <Button
                                                    sime="sm"
                                                    name="Thursday"
                                                    onClick={this.deleteSlot}
                                                    variant="outline-danger">
                                                    Remove</Button>
                                                </p>} 
                                        </>
                                    ))}
                                </td>
                                <td>
                                    {fridaySlots && fridaySlots.map(fridaySlot => (
                                        <>
                                          {fridaySlot && <p>
                                              {fridaySlot[0]} - {fridaySlot[1]}
                                              <Button
                                                    sime="sm"
                                                    name="Friday"
                                                    onClick={this.deleteSlot}
                                                    variant="outline-danger">
                                                    Remove</Button>
                                              </p>} 
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
                                        onClick={this.saveSlot}>
                                            Add Slot
                                        </Button>
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </Table>
                </Container>
            </>
        )
    }
}