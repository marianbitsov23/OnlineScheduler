import React, { Component } from 'react';
import { Container, Button } from 'react-bootstrap';
import subjectService from '../../services/schedule/subject.service';
import ModelInput from '../shared/model-input.component';
import { Link } from 'react-router-dom';
import scheduleService from '../../services/schedule/schedule.service';

export default class ManageSubjects extends Component {
    constructor(props) {
        super(props);

        this.state = {
            subjects: [],
            schedule: scheduleService.getCurrentSchedule()
        };
    }

    componentDidMount() {
        subjectService.getAllByScheduleId(this.state.schedule.id)
        .then(result => {
            this.setState({ subjects: result.data });
        })
        .catch(error => {
            console.error(error);
        });
    }
    
    render() {

        const { subjects} = this.state;

        return(
            <>
                <Container>
                    <ModelInput type="subject" elements={subjects} service={subjectService} />
                </Container>
                <Link to={"/teacher-management"}>
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