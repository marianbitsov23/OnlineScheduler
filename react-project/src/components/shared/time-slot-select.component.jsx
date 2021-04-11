import { TableContainer, Table, TableHead, 
        TableRow, TableCell, TableBody, Paper } from "@material-ui/core";
import React, { Component } from "react";
import { Button } from 'react-bootstrap';

export default class TimeSlotSelect extends Component {
    constructor(props) {
        super(props);

        this.state = {
            weekDays: undefined,
            weekDaysTemplate: [],
            timeSlotTemplateMorning: [],
            timeSlotTemplateEvening: [],
            ammount: 0,
        }
    }

    addTimeSlot(dayName) {
        const { timeSlotTemplateMorning, timeSlotTemplateEvening,
                weekDays, setSlots } = this.props;
        const day = dayName[0];
        let timeSlotTemplate = [];

        this.props.time === 0 ? timeSlotTemplate = timeSlotTemplateMorning 
            : timeSlotTemplate = timeSlotTemplateEvening;
        
        let newTimeSlots = weekDays.filter(weekDay => weekDay.weekDay === day.toUpperCase());

        if(newTimeSlots.length < 7) {
            weekDays.push({
                weekDay: day.toUpperCase(),
                timeStart: timeSlotTemplate[newTimeSlots.length][0],
                timeEnd: timeSlotTemplate[newTimeSlots.length][1]
            });
        }

        setSlots(weekDays);
    }

    deleteSlot = event => {
        event.preventDefault();

        let timeSlots = this.props.weekDays;

        timeSlots.splice(event.target.value, 1);

        console.log(timeSlots);

        this.setState({ weekDays: timeSlots });
    }

    
    addSlot = event => {
        event.preventDefault();
        const weekDay = [event.target.name];

        this.addTimeSlot(weekDay);
    }

    selectSlot = event => {
        event.preventDefault();

        let { timeSlots, changeTimeSlots, ammount } = this.props;

        timeSlots[event.target.value].selected = !timeSlots[event.target.value].selected;
        
        timeSlots[event.target.value].selected ? ammount++ : ammount--;

        changeTimeSlots(timeSlots, ammount);

    }

    render() {
        const { weekDays, weekDaysTemplate } = this.props;

        let numberOfRows = [1, 2, 3, 4, 5, 6, 7];
        let timeSlots;

        this.props.timeSlots !== undefined 
            ? timeSlots = this.props.timeSlots
            : timeSlots = weekDays;

        if(timeSlots) {
            this.props.weekDaysTemplate.forEach(weekDayTemplate => {
                let index = 0;
                timeSlots.forEach(res => {
                    if(res.weekDay === weekDayTemplate.toUpperCase()) {
                        index++;
                        res.index = index;
                    }
                });
            });
        }

        return (
            <>
                <TableContainer component={Paper} className="myDefaultMarginTopBottom">
                <Table>
                    <TableHead className="primaryBackground">
                        <TableRow>
                            <TableCell className="myTextAlignCenter myWhiteColor">
                                Понеделник
                            </TableCell>
                            <TableCell className="myTextAlignCenter myWhiteColor">
                                Вторник
                            </TableCell>
                            <TableCell className="myTextAlignCenter myWhiteColor">
                                Сряда
                            </TableCell>
                            <TableCell className="myTextAlignCenter myWhiteColor">
                                Четвъртък
                            </TableCell>
                            <TableCell className="myTextAlignCenter myWhiteColor">
                                Петък
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {numberOfRows.map(row => (
                            <TableRow key={row}>
                                {weekDaysTemplate.map((weekDayTemplate, index) => (
                                    <TableCell className="defaultSlot" key={index}>
                                        {timeSlots.map((timeSlot, index) => (
                                            <div key={index}>
                                            {timeSlot.weekDay === weekDayTemplate.toUpperCase() &&
                                            timeSlot.index === row &&
                                                <div className="timeSlot">
                                                    <div className="timeRange">
                                                        {timeSlot.timeStart} - {timeSlot.timeEnd}
                                                    </div>
                                                    <div className="timeButton">
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
                                                    </div>
                                                </div>
                                            }
                                            </div>
                                        ))}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                        <TableRow>
                            {this.props.type !=='select' && weekDaysTemplate && weekDaysTemplate.map((weekDayTemplate, index) => (
                                <TableCell className="myTextAlignCenter" key={index}>
                                    <Button
                                        variant="primary"
                                        name={weekDayTemplate}
                                        disabled={this.props.edit}
                                        onClick={this.addSlot}>
                                            Добави час
                                    </Button>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableBody>
                </Table>
                </TableContainer>
            </>
        )
    }
}