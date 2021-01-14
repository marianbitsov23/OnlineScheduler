import React, { Component } from 'react';
import { Container, Card, FormGroup, Button, Table, Modal } from 'react-bootstrap';
import subjectService from '../../services/schedule/subject.service';
import ModelInput from '../shared/model-input.component';

export default class CreateSubject extends Component {
    constructor(props) {
        super(props);

        this.state = {
            subjects: [],
        };
    }

    componentDidMount() {
        subjectService.getAllSubjects()
        .then(result => {
            this.setState({ subjects: result.data });
        })
        .catch(error => {
            console.error(error);
        })
    }
    
    render() {

        const { subjects} = this.state;

        return(
            <>
                <Container>
                    <ModelInput type="subject" elements={subjects} service={subjectService} />
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