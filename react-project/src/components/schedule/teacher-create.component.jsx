import React, { Component } from 'react';
import { Container, Button } from 'react-bootstrap';
import teacherService from '../../services/schedule/teacher.service';
import ModelInput from '../shared/model-input.component';
import { Link } from 'react-router-dom';
import scheduleService from '../../services/schedule/schedule.service';

export default class CreateTeacher extends Component {
    constructor(props) {
        super(props);

        this.state = {
            teachers: [],
            schedule: scheduleService.getCurrentSchedule()
        };
    }

    componentDidMount() {
        teacherService.getAllTeachersByScheduleId(this.state.schedule.id)
        .then(result => {
            this.setState({ teachers: result.data });
        })
        .catch(error => {
            console.error(error);
        });
    }

    render() {

        const { teachers } = this.state;

        return(
            <>
                <Container>
                    <ModelInput type="teacher" elements={teachers} service={teacherService}/>
                </Container>
                <Link to={"/create-cabinet"}>
                    <Button
                        className="btn-block"
                    >
                        Напред
                    </Button>
                </Link>
            </>
        );
    }
}