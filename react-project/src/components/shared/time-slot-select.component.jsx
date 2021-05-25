import { TableContainer, Table, TableHead, Grid,
        TableRow, TableCell, TableBody, Paper, TextField } from "@material-ui/core";
import React, { Component } from "react";
import { Button } from 'react-bootstrap';
import { CustomDialog } from "./custom-dialog.component";
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { EditButton } from "./custom-buttons/edit-button.component";

export default class TimeSlotSelect extends Component {
    constructor(props) {
        super(props);

        this.state = {
            weekDays: undefined,
            weekDaysTemplate: [],
            timeSlotTemplateMorning: [],
            timeSlotTemplateEvening: [],
            selectedStartDate: "08:00",
            selectedEndDate: "",
            selectedDay: 0,
            selectedIndex: 0,
            ammount: 0,
            edit: false,
            show: false
        };
    }

    addTimeSlot = () => {
        const { weekDays, setSlots, weekDaysTemplate } = this.props;
        const { selectedStartDate, selectedEndDate } = this.state;

        weekDaysTemplate.forEach(day => {
            let newTimeSlots = weekDays.filter(weekDay => weekDay.weekDay === day.toUpperCase());
            if(newTimeSlots.length < 10) {
                weekDays.push({
                    weekDay: day.toUpperCase(),
                    timeStart: selectedStartDate,
                    timeEnd: selectedEndDate
                });
            }
        });

        setSlots(weekDays);
        this.setState({ show: false, selectedStartDate: selectedEndDate, selectedEndDate: "" });
    }

    editSlot = () => {
        const { weekDays, setSlots } = this.props;
        const { selectedDay, selectedStartDate, selectedEndDate, selectedIndex } = this.state;

        let selectedTimeSlots = weekDays.filter(weekDay => weekDay.weekDay === selectedDay.toUpperCase());
        selectedTimeSlots[selectedIndex - 1].timeStart = selectedStartDate;
        selectedTimeSlots[selectedIndex - 1].timeEnd = selectedEndDate;

        setSlots(weekDays);
        this.setState({ show: false, edit: false, selectedStartDate: selectedEndDate, selectedEndDate: "" });
    }

    deleteSlot = event => {
        let timeSlots = this.props.weekDays;
        timeSlots.splice(event.target.value, 1);
        this.setState({ weekDays: timeSlots });
    }

    selectSlot = event => {
        let { timeSlots, changeTimeSlots, ammount } = this.props;

        timeSlots[event.target.value].selected = !timeSlots[event.target.value].selected;
        timeSlots[event.target.value].selected ? ammount++ : ammount--;

        changeTimeSlots(timeSlots, ammount);
    }

    onChange = event => this.setState({ [event.target.name] : event.target.value });

    render() {
        const { weekDays, weekDaysTemplate } = this.props;
        const { selectedStartDate, selectedEndDate } = this.state;

        let numberOfRows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        let timeSlots;

        this.props.timeSlots !== undefined 
            ? timeSlots = this.props.timeSlots
            : timeSlots = weekDays;

        if(timeSlots) {
            weekDaysTemplate.forEach(weekDayTemplate => {
                let index = 0;
                timeSlots.forEach(res => {
                    if(res.weekDay === weekDayTemplate.toUpperCase()) {
                        index++;
                        res.index = index;
                    }
                });
            });
        }

        const isInvalid = selectedEndDate === selectedStartDate ||
            selectedEndDate === null ||
            selectedStartDate === null;

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
                                                            onClick={() => this.setState({ 
                                                                edit: true,
                                                                show: true,
                                                                selectedIndex: timeSlot.index,
                                                                selectedDay: weekDayTemplate,
                                                                selectedStartDate: timeSlot.timeStart,
                                                                selectedEndDate: timeSlot.timeEnd
                                                        })}
                                                        variant="outline-info">
                                                        Промяна</Button>}
                                                        {this.props.type !=='select' &&
                                                        <Button
                                                            size="sm"
                                                            value={timeSlots.indexOf(timeSlot)}
                                                            onClick={this.deleteSlot}
                                                            variant="outline-danger">
                                                            Изтриване</Button>}
                                                        {!timeSlot.selected &&
                                                        this.props.type ==='select' &&
                                                            <Button
                                                                size="sm"
                                                                value={timeSlots.indexOf(timeSlot)}
                                                                onClick={this.selectSlot}
                                                                variant="outline-success">
                                                                Избери</Button>}
                                                        {timeSlot.selected && 
                                                        this.props.type ==='select' &&
                                                        <Button
                                                            size="sm"
                                                            value={timeSlots.indexOf(timeSlot)}
                                                            onClick={this.selectSlot}
                                                            variant="outline-danger">
                                                            Премахване</Button>}
                                                    </div>
                                                </div>
                                            }
                                            </div>
                                        ))}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}   
                    </TableBody>
                </Table>
                {this.props.type !=='select' && weekDaysTemplate && 
                    <EditButton
                        fullWidth={true}
                        disabled={this.props.edit}
                        onClick={() => this.setState({ show: true })}
                        text="Добави нова колона от часове"
                    />
                }
                </TableContainer>
                <CustomDialog
                    show={this.state.show}
                    onClose={() => this.setState({ show: false })}
                    title="Задайте начало и край на часа"
                    confirmFunction={this.state.edit ? this.editSlot : this.addTimeSlot}
                    disabled={isInvalid}
                    confirmButtonText="Добави час"
                    content={
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid container justify="space-around">
                                <TextField
                                    margin="normal"
                                    type="time"
                                    name="selectedStartDate"
                                    label="Начало:"
                                    value={selectedStartDate}
                                    onChange={this.onChange}
                                    InputLabelProps={{
                                        shrink: true,
                                      }}
                                      inputProps={{
                                        step: 300, // 5 min
                                      }}
                                />
                                <TextField
                                    margin="normal"
                                    type="time"
                                    name="selectedEndDate"
                                    label="Край:"
                                    value={selectedEndDate}
                                    onChange={this.onChange}
                                    InputLabelProps={{
                                        shrink: true,
                                      }}
                                      inputProps={{
                                        step: 300, // 5 min
                                      }}
                                />
                            </Grid>
                        </MuiPickersUtilsProvider>
                    }
                />
            </>
        )
    }
}