import React, { Component } from 'react';
import { Container, Card, FormGroup, Button, Modal, Table } from 'react-bootstrap';
import FormBootstrap from 'react-bootstrap/Form';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import teacherService from '../../services/schedule/teacher.service';
import scheduleService from '../../services/schedule/schedule.service';
import TableList from '../shared/table.component';

export default class CreateTeacher extends Component {
    constructor(props) {
        super(props);

        this.state = {
            teacherName: "",
            initials: "",
            loading: false,
            teachers: [],
            schedule: scheduleService.getCurrentSchedule()
        };

        this.createTeacher.bind(this);
        this.onChange.bind(this);
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
    

    createTeacher = event => {
        event.preventDefault();

        this.setState({ loading: true });

        const { teacherName, initials, teacherSubjects, schedule } = this.state;

        //TODO: fix saving duplicate teachers

        teacherService.createTeacher(teacherName, initials, schedule)
        .then(result => {
            this.state.teachers.push(result.data);
            this.setState({ firstName: "", lastName: "", initials: "", loading: false });
        })
        .catch(error => {
            console.error(error);
        });
    }

    onChange = event => {
        event.preventDefault();

        this.setState({ [event.target.name] : event.target.value });
    }

    render() {

        const { teacherName, teachers, initials } = this.state;

        const isInvalid = 
            teacherName === ""||
            initials === "";

        return(
            <>
                <Container>
                    <Card>
                        <Card.Header>Добави нов учител</Card.Header>
                        <Card.Body>
                            <Form
                                onSubmit={this.createTeacher}
                                ref={c => {
                                    this.form = c;
                                }}
                            >
                                <FormGroup>
                                    <FormBootstrap.Label htmlFor="teacherName">Име</FormBootstrap.Label>
                                    <Input
                                        type="texasfast"
                                        className="form-control"
                                        name="teacherName"
                                        value={this.state.teacherName}
                                        onChange={this.onChange}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <FormBootstrap.Label htmlFor="initials">Инициали</FormBootstrap.Label>
                                    <Input
                                        type="texasfast"
                                        className="form-control"
                                        name="initials"
                                        value={this.state.initials}
                                        onChange={this.onChange}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Button
                                        type="submit"
                                        variant="success"
                                        className="btn-block"
                                        disabled={isInvalid}>
                                            {this.state.loading &&
                                                <span className="spinner-border spinner-border-sm"></span>
                                            }
                                            <span>Добави</span>
                                        </Button>
                                </FormGroup>
                            </Form>
                        </Card.Body>
                    </Card>
                </Container>
                <hr />
                <Container>
                    <TableList type="учителя" elements={teachers} service={teacherService} />
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