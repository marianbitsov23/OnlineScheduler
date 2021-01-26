import React, { Component } from "react";
import { Button, Card } from "react-bootstrap";
import { Link } from 'react-router-dom';
import scheduleService from "../services/schedule/schedule.service";
import authService from "../services/user-auth/auth.service";
import { Grid } from '@material-ui/core';

export default class ScheduleBoard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            content: "",
            schedules: [],
            currentUser: authService.getCurrentUser()
        };
    }

    componentDidMount() {
        const { currentUser } = this.state;

        scheduleService.getSchedulesByCreatorId(currentUser.id)
        .then(result => {
            this.setState({ schedules: result.data });
        })
        .catch(error => {
            console.error(error);
        })
    }

    render() {
        const { schedules } = this.state;

        return (
            <Grid container className="myFlexGrow">
                <Grid container justify="center" item xs={12}>
                    {schedules.map(schedule => (
                        <Link to={'/schedule-dashboard'} 
                        onClick={() => scheduleService.saveCurrentSchedule(schedule)} 
                        className="nav-link"
                        >
                            <Card bg="primary" text="white" 
                            className="myDefaultMargin"
                            style={{ width: '20rem' }}>
                                {!this.state.edit &&
                                    <Card.Header>{schedule.name}</Card.Header>
                                }
                                <Card.Body>
                                    <Card.Title>{schedule.parentGroup.name}</Card.Title>
                                    <Card.Text>
                                        {schedule.description}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Link>
                    ))}
                </Grid>
                <Grid container justify="center" className="myDefaultPadding" xs={12}>
                    <Link to={"/schedule-management"}>
                        <Button variant="info">Create new schedule</Button>
                    </Link>
                </Grid>
            </Grid>
        );
    }
}