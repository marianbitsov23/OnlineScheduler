import React, { Component } from 'react';
import TableList from '../../shared/table.component';
import { Container, Jumbotron } from 'react-bootstrap';
import timeTableService from '../../../services/schedule/time-management/time-table.service';
import timeSlotService from '../../../services/schedule/time-management/time-slot.service';
import scheduleService from '../../../services/schedule/schedule.service';
import TimeSlotSelect from '../../shared/time-slot-select.component';
import { ButtonPagination } from '../../shared/custom-buttons/button-pagination.component';
import { SaveButton } from '../../shared/custom-buttons/save-button.component';
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
            loading: false,
            edit: true,
            time: 0,
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

        weekDaysTemplate.push('Monday');
        weekDaysTemplate.push('Tuesday');
        weekDaysTemplate.push('Wednesday');
        weekDaysTemplate.push('Thursday');
        weekDaysTemplate.push('Friday');
        
        this.setState({ 
            weekDaysTemplate : weekDaysTemplate,
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

        const empty = weekDays.length === 0;

        console.log(weekDays);

        return(
            <>
                <Container>
                    <Jumbotron>
                        <h1 className="margin-bottom-16px text-align-center">Времеви таблици</h1>
                        {!edit &&
                            <>
                                <h2 className="margin-bottom-16px">Име на времевата таблица: {name}</h2>

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
                                <Typography variant="p">
                                    Времевата таблица представлява празното разписание, разграфено по часови диапазони. <br/>
                                    Въведете име на времевата таблица! <br/>
                                    Въвдете времевите диапазони за часовете, отнасящи за всеки ден от седмицата!
                                </Typography>

                                <TextInput
                                    name="name"
                                    value={this.state.name}
                                    label="Име на времевата таблица"
                                    onChange={this.onChange}
                                    type="text"
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
                        setSlots={this.setSlots}
                    />
                    <SaveButton
                        fullWidth={true}
                        text="Създай времева таблица"
                        onClick={this.saveTimeTable}
                        disabled={empty}
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