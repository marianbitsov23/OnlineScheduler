import React, { Component } from "react";
import { Button, Card } from "react-bootstrap";
import { Link } from 'react-router-dom';
import scheduleService from "../services/schedule/schedule.service";
import authService from "../services/user-auth/auth.service";
import { Grid, IconButton, Backdrop, CircularProgress } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { CustomDialog } from "./shared/custom-dialog.component";
import { TextInput } from "./shared/text-input.component";
import { CustomAlert } from "./shared/custom-alert.component";

export default class ScheduleBoard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fail: false,
            show: false,
            content: "",
            loading: false,
            schedules: [],
            scheduleName: "",
            selectedSchedule: 0,
            errorMessage: "",
            currentUser: authService.getCurrentUser()
        };
    }

    componentDidMount() {
        const { currentUser } = this.state;

        scheduleService.getSchedulesByCreatorId(currentUser.id)
        .then(result => this.setState({ schedules: result.data }))
        .catch(error => console.error(error))
    }

    onClose = () => this.setState({ show: !this.state.show });

    onChange = event => this.setState({ [event.target.name] : event.target.value });

    onDelete = index => this.setState({ selectedSchedule: index, show: true });

    handleFail = () => this.setState({ fail: false });

    deleteSchedule = () => {
        const schedule = this.state.schedules[this.state.selectedSchedule];
        
        this.setState({ loading: true });

        if(this.state.scheduleName === schedule.name) {
            scheduleService.deleteSchedule(schedule.id)
            .then(() => {
                scheduleService.setPreviousSchedules([]);
                this.setState({ schedules: this.state.schedules.filter(s => s.id !== schedule.id), show: false, loading: false });
            })
            .catch(error => console.error(error));
        } else {
            this.setState({ fail: true });
        }
    }

    render() {
        const { schedules, show, scheduleName, selectedSchedule, fail, loading } = this.state;

        return (
            <>
                <Backdrop style={{ color: '#fff', zIndex: '1500' }} open={loading}>
                    <CircularProgress color="inherit" />
                </Backdrop>

                <CustomAlert
                    open={fail}
                    onClose={this.handleFail}
                    alertText="Въведено е грешно името на графика!"
                    variant="error"
                />

                <Grid container className="myFlexGrow">
                    <Grid container justify="center" item xs={12}>
                        {schedules.map((schedule, index) => (
                            <Card bg="primary" text="white" 
                            className="myDefaultMargin"
                            style={{ width: '20rem', height: '12rem' }}>
                                {!this.state.edit &&
                                    <Card.Header className="myDisplayFlex justify-content-space-between">
                                        {schedule.name}
                                        <IconButton
                                            color="inherit"
                                            onClick={this.onDelete.bind(this, index)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Card.Header>
                                }
                                <Card.Body>
                                <Link to={'/schedule-dashboard'} 
                                    onClick={() => scheduleService.saveCurrentSchedule(schedule)} 
                                    className="nav-link myWhiteColor"
                                    key={schedule.id}
                                >
                                    <Card.Text>
                                        {schedule.description}
                                    </Card.Text>
                                </Link>
                                </Card.Body>
                            </Card>
                        ))}
                    </Grid>
                    <Grid container justify="center" className="myDefaultPadding" item xs={12}>
                        <Link to={"/schedule-management"}>
                            <Button variant="info">Създай нов график</Button>
                        </Link>
                    </Grid>
                </Grid>
                {schedules[selectedSchedule] &&
                <CustomDialog 
                    danger={true}
                    show={show}
                    onClose={this.onClose}
                    title="Абсолютно сигурни ли сте, че искате да изтриете графика?"
                    confirmFunction={this.deleteSchedule}
                    confirmButtonText="Изтриване"
                    text=
                    {<>
                        Напълно сигурни ли сте че искате да изтриете този график?
                        Изтриването е перманентно и графикът не може да бъде възстановен!
                        Въведете името на графика <div className="scheduleName">{schedules[selectedSchedule].name}</div> 
                        и натиснете <span className="deleteButtonText">Изтриване</span> бутона, за да потвърдите.
                    </>}
                    content=
                    {<>
                        <TextInput 
                            name="scheduleName"
                            value={scheduleName}
                            label="Въведете името на графика"
                            type="scheduleName"
                            onChange={this.onChange}
                        />
                    </>}
                />}
            </>
        );
    }
}