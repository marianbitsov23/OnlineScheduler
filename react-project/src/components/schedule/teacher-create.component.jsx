import React, { Component } from 'react';
import { Container, Button } from 'react-bootstrap';
import teacherService from '../../services/schedule/teacher.service';
import ModelInput from '../shared/model-input.component';

export default class CreateTeacher extends Component {
    constructor(props) {
        super(props);

        this.state = {
            teachers: [],
        };
    }

    componentDidMount() {
        teacherService.getAllTeachers()
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
                <Button
                    className="btn-block"
                >
                    Напред
                </Button>
            </>
        );
    }
}