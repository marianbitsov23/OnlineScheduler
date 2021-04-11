import React, { Component } from 'react';
import teacherService from '../../services/schedule/teacher.service';
import ModelInput from '../shared/model-input.component';
import scheduleService from '../../services/schedule/schedule.service';
import { Container } from '@material-ui/core';
import { ButtonPagination } from '../shared/custom-buttons/button-pagination.component';

export default class ManageTeachers extends Component {
    constructor(props) {
        super(props);

        this.state = {
            teachers: [],
            schedule: scheduleService.getCurrentSchedule()
        };
    }

    componentDidMount() {
        teacherService.getAllByScheduleId(this.state.schedule.id)
        .then(result => {
            this.setState({ teachers: result.data });
        })
        .catch(error => console.error(error));
    }

    render() {
        const { teachers } = this.state;

        return(
            <Container>
                <ModelInput type="teacher" elements={teachers} service={teacherService}/>
                <ButtonPagination
                    backwardLink={"/subject-management"}
                    forwardLink={"/cabinet-management"}
                />
            </Container>
        );
    }
}