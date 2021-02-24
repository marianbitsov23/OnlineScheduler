import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import subjectService from '../../services/schedule/subject.service';
import ModelInput from '../shared/model-input.component';
import { NextButton } from '../shared/next-button.component';
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
        .catch(error => console.error(error));
    }
    
    render() {

        const { subjects} = this.state;

        return(
            <Container>
                <ModelInput type="subject" elements={subjects} service={subjectService} />
                <NextButton link={"/teaching-hour-management"}/>
            </Container>
        );
    }
}