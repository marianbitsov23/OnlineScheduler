import React, { Component } from 'react';
import TableList from '../../shared/table.component';
import { Container, Button, Jumbotron } from 'react-bootstrap';
import timeTableService from '../../../services/schedule/time-management/time-table.service';
import timeSlotService from '../../../services/schedule/time-management/time-slot.service';
import scheduleService from '../../../services/schedule/schedule.service';
import TimeSlotSelect from '../../shared/time-slot-select.component';
import { ButtonPagination } from '../../shared/custom-buttons/button-pagination.component';
import { SaveButton } from '../../shared/custom-buttons/save-button.component';
import { CustomSelect } from '../../shared/custom-select.component';
import { TextInput } from '../../shared/text-input.component';
import { EditButton } from '../../shared/custom-buttons/edit-button.component';
import { Typography } from '@material-ui/core';

export default class ManageTimeTables extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            weekDays: [],
            weekDaysTemplate: [],
            timeSlotTemplateMorning: [],
            timeSlotTemplateEvening: [],
            loading: false,
            edit: true,
            time: 0,
            shifts: [{name: 'Първа смяна'}, {name: 'Втора смяна'}],
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
            weekDaysTemplate : weekDaysTemplate,
            timeSlotTemplateMorning : timeSlotTemplateMorning,
            timeSlotTemplateEvening: timeSlotTemplateEvening
        });
    }

    onChange = event => this.setState({ [event.target.name] : event.target.value });

    async saveAllTimeSlotsByDayInDb(tableId) {
        const { weekDays } = this.state;

        for(let i = 0; i < weekDays.length; i++) {
            await timeSlotService.createTimeSlot(
                weekDays[i].weekDay, 
                weekDays[i].timeStart, 
                weekDays[i].timeEnd, 
                tableId
            );
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
                this.setState({ 
                    edit: true, 
                    name: "", 
                    loading: false, 
                    weekDays: []
                });
            })
        });
    }

    setSlots = (weekDays) => this.setState({ weekDays });

    render() {
        const { name, weekDays, weekDaysTemplate, edit, timeTables } = this.state;

        const isInvalid = name === "";

        return(
            <>
                <Container>
                    <Jumbotron>
                        {!edit &&
                            <>
                                <Typography>{name}</Typography>

                                <EditButton
                                    fullWidth={true}
                                    text="Редактирай"
                                    onClick={() => {
                                        this.setState({ edit: true, weekDays: [] }); 
                                        this.initWeekDays();
                                    }}
                                />
                            </>
                        }

                        {edit &&
                            <>
                                <TextInput
                                    name="name"
                                    value={this.state.name}
                                    label="Име на времевата таблица"
                                    onChange={this.onChange}
                                    type="text"
                                />

                                <CustomSelect
                                    label="Изберете за коя смяна се отнася следият график"
                                    name="time"
                                    value={this.state.time}
                                    onChange={this.onChange}
                                    elements={this.state.shifts}
                                />

                                <SaveButton
                                    fullWidth={true}
                                    disabled={isInvalid}
                                    text="Запази"
                                    onClick={() => this.setState({ edit: false })}
                                />
                            </>
                        }
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
                    <SaveButton
                        fullWidth={true}
                        text="Създай времева таблица"
                        onClick={this.saveTimeTable}
                        disabled={edit}
                    />
                </Container>
                <Container>
                    <TableList type="time-table" elements={timeTables} service={timeTableService} />
                    <ButtonPagination
                        backwardLink={"/cabinet-management"}
                        forwardLink={"/teaching-hour-management"}
                    />
                </Container>
            </>
        )
    }
}