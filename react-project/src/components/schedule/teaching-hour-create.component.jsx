import React, { Component } from 'react';
import { Container, Button } from 'react-bootstrap';
import teachingHourService from '../../services/schedule/teaching-hour.service';
import ModelInput from '../shared/model-input.component';
import { Link } from 'react-router-dom';

export default class CreateTeachingHour extends Component {
    constructor(props) {
        super(props);

        this.state = {
            teachingHours: [],
        };
    }

    componentDidMount() {
        teachingHourService.getTeachingHours()
        .then(result => {
            this.setState({ teachingHourService: result.data });
        })
        .catch(error => {
            console.error(error);
        });
    }

    render() {
        const { teachingHours } = this.state;

        return(
            <>
                <Container>
                    <ModelInput type="teaching-hour" elements={teachingHours} service={teachingHourService}/>
                </Container>
                <Link to={"/"}>
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