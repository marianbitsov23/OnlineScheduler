import React, { Component } from 'react';
import { Container, Button, Jumbotron } from 'react-bootstrap';
import teachingHourService from '../../services/schedule/teaching-hour.service';
import subjectService from '../../services/schedule/subject.service';
import ModelInput from '../shared/model-input.component';
import { Link } from 'react-router-dom';
import scheduleService from '../../services/schedule/schedule.service';

export default class CreateTeachingHour extends Component {
    constructor(props) {
        super(props);

        this.state = {
            teachingHours: [],
            subjects: [],
            schedule: scheduleService.getCurrentSchedule()
        };
    }

    componentDidMount() {
        teachingHourService.getAllTeachingHours()
        .then(result => {
            this.setState({ teachingHourService: result.data });
        })
        .catch(error => {
            console.error(error);
        });

        subjectService.getAllSubjectsByScheduleId(this.state.schedule.id)
        .then(result => {
            this.setState({ subjects: result.data });
        })
        .catch(error => {
            console.error(error);
        });

    }

    render() {
        const { teachingHours, subjects } = this.state;

        console.log(subjects);

        return(
            <>
                <Container>
                    <Jumbotron fluid>
                        <Container>
                            <h1>Хорариум</h1>
                            <p>Въведете групата за която се отнася, преподавател, 
                            предмет, колко часа в седмицата ще се преподава и в кои кабинети!</p>
                        </Container>
                    </Jumbotron>
                </Container>
                <Container>
                    <ModelInput type="teacing-hour" elements={teachingHours} service={teachingHourService}/>
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