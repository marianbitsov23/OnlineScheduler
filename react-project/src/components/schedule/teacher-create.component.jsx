import React, { Component } from 'react';
import { Container, Card, FormGroup, Button } from 'react-bootstrap';
import FormBootstrap from 'react-bootstrap/Form';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import teacherService from '../../services/teacher.service';
import subjectService from '../../services/subject.service';

export default class CreateTeacher extends Component {
    constructor(props) {
        super(props);

        this.state = {
            teacherName: "",
            subjects: [],
            loading: false,
            teachers: []
        };

        this.saveTeacher.bind(this);
    }

    componentDidMount() {
        teacherService.getAllTeachers()
        .then(result => {
            this.setState({ teachers: result.data });
        })
        .then(() => {
            subjectService.getAllSubjects()
            .then(result => {
                this.setState({ subjects: result.data });
            })
            .catch(error => {
                console.error(error);
            });
        })
        .catch(error => {
            console.error(error);
        });
    }
    

    saveTeacher = event => {
        event.preventDefault();

        this.setState({ loading: true });

        const { teacherName, subjects } = this.state;

        //TODO: fix saving duplicate teachers

        teacherService.createTeacher(teacherName, subjects)
        .then(result => {
            this.state.teachers.push(result.data);
            this.setState({ teacherName: "", loading: false });
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

        const { teacherName, teachers, subjects } = this.state;

        const isInvalid = teacherName === "";

        return(
            <>
                <Container>
                    <h2> Teachers : </h2>
                    {teachers.map(teacher => (
                        <li key={teacher.id}> {teacher.teacherName} : {teacher.subjects} </li>
                    ))}
                </Container>

                <Container>
                    <Card>
                        <Card.Header>Add Teacher</Card.Header>
                        <Card.Body>
                            <Form
                                onSubmit={this.saveTeacher}
                                ref={c => {
                                    this.form = c;
                                }}
                            >
                                <FormGroup>
                                    <FormBootstrap.Label htmlFor="teacherName">Teacher name</FormBootstrap.Label>
                                    <Input
                                        type="texasfast"
                                        className="form-control"
                                        name="teacherName"
                                        value={this.state.teacherName}
                                        onChange={this.onChange}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <FormBootstrap.Label htmlFor="subjects">
                                        Which subject he teaches?
                                    </FormBootstrap.Label>
                                    <select 
                                        //multiple={true}
                                        name="subjects" 
                                        value={subjects[0]}
                                        onChange={this.onChange}>
                                        {(subjects.map(subject => (
                                            <option key={subject.id} value={subject}>{subject.subjectName}</option>
                                        )))}
                                        
                                    </select>
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
                                            <span>Save Teacher</span>
                                        </Button>
                                </FormGroup>

                                <FormGroup>
                                    <Button
                                        variant="primary"
                                        className="btn-block"
                                        disabled={isInvalid}>
                                            {this.state.loading &&
                                                <span className="spinner-border spinner-border-sm"></span>
                                            }
                                            <span>Continue</span>
                                        </Button>
                                </FormGroup>
                            </Form>
                        </Card.Body>
                    </Card>
                </Container>
            </>
        );
    }
}