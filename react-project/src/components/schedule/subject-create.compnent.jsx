import React, { Component } from 'react';
import { Container, Button } from 'react-bootstrap';
import subjectService from '../../services/schedule/subject.service';
import ModelInput from '../shared/model-input.component';
import { Link } from 'react-router-dom';

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
                <Link to={"/create-teacher"}>
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