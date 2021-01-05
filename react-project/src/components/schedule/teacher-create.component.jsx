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
            firstName: "",
            lastName: "",
            teacherSubjects: [],
            allSubjects: [],
            loading: false,
            teachers: []
        };

        this.saveTeacher.bind(this);
        this.onChange.bind(this);
    }

    componentDidMount() {
        teacherService.getAllTeachers()
        .then(result => {
            const resultTeachers = result.data;
            this.setState({ teachers: resultTeachers });
        })
        .then(() => {
            subjectService.getAllSubjects()
            .then(result => {
                this.setState({allSubjects: result.data });
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

        const { firstName, lastName, teacherSubjects } = this.state;

        //TODO: fix saving duplicate teachers

        teacherService.createTeacher(firstName + ' ' + lastName, teacherSubjects)
        .then(result => {
            this.state.teachers.push(result.data);
            this.setState({ firstName: "", lastName: "", loading: false });
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

        const { firstName, lastName, teachers,
            allSubjects, teacherSubjects } = this.state;

        const isInvalid = 
            firstName === ""||
            lastName === "";

        return(
            <>
                <Container>
                    <h2> Teachers : </h2>
                    {teachers && teachers.map(teacher => (
                        <li key={teacher.id}> 
                        {teacher.teacherName}
                        </li>
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
                                    <FormBootstrap.Label htmlFor="teacherName">First name</FormBootstrap.Label>
                                    <Input
                                        type="texasfast"
                                        className="form-control"
                                        name="firstName"
                                        value={this.state.firstName}
                                        onChange={this.onChange}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <FormBootstrap.Label htmlFor="teacherName">Last name</FormBootstrap.Label>
                                    <Input
                                        type="texasfast"
                                        className="form-control"
                                        name="lastName"
                                        value={this.state.lastName}
                                        onChange={this.onChange}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <FormBootstrap.Label htmlFor="subjects">
                                        Which subject he teaches?
                                    </FormBootstrap.Label>
                                    {(allSubjects.map(subject => {
                                        if(teacherSubjects.includes(subject)) {
                                            return (
                                                <>
                                                    <p key={subject.subjectName}>
                                                        {subject.subjectName}
                                                    </p>
                                                    <Button
                                                        key={subject.id}
                                                        variant="outline-danger"
                                                        //TODO: Find a way to extract it
                                                        onClick={() => {
                                                            let newTeacherSubjects = teacherSubjects;
                                                            newTeacherSubjects.splice(newTeacherSubjects.indexOf(subject), 1);

                                                            this.setState({ teacherSubjects: newTeacherSubjects });
                                                        }}
                                                    >Remove</Button>
                                                </>
                                            )
                                        } else {
                                            return(
                                                <>
                                                    <p key={subject.subjectName}>
                                                        {subject.subjectName}
                                                    </p>
                                                    <Button
                                                        key={subject.id / 2}
                                                        variant="outline-info"
                                                        //TODO: Find a way to extract it
                                                        onClick={() => {
                                                            let newTeacherSubjects = teacherSubjects;
                                                            newTeacherSubjects.push(subject);

                                                            this.setState({ teacherSubjects: newTeacherSubjects });
                                                        }}
                                                    >Add</Button>
                                                </>
                                            )
                                        }
                                }))}
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