import React, { Component } from 'react';
import { Container, Card, FormGroup, Button, Modal, Table } from 'react-bootstrap';
import FormBootstrap from 'react-bootstrap/Form';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import teacherService from '../../services/schedule/teacher.service';
import subjectService from '../../services/schedule/subject.service';
import scheduleService from '../../services/schedule/schedule.service';

export default class CreateTeacher extends Component {
    constructor(props) {
        super(props);

        this.state = {
            teacherName: "",
            teacherSubjects: [],
            initials: "",
            allSubjects: [],
            loading: false,
            teachers: [],
            editableTeacher: {},
            show: false,
            schedule: scheduleService.getCurrentSchedule()
        };

        this.createTeacher.bind(this);
        this.onChange.bind(this);
        this.editTeacherName.bind(this);
        this.editTeacherInitials.bind(this);
    }

    componentDidMount() {
        teacherService.getAllTeachers()
        .then(result => {
            this.setState({ teachers: result.data });
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

    deleteTeacher = teacher => {
        let { teachers } = this.state;

        teacherService.deleteTeacher(teacher.id)
        .then(() => {
            teachers.splice(teachers.indexOf(teacher), 1);
            this.setState({ teachers });
        })
        .catch(error => {
            console.error(error);
        });
    }

    onChange = event => {
        event.preventDefault();

        this.setState({ [event.target.name] : event.target.value });
    }

    onShow = teacher => {
        this.setState({ show: !this.state.show, editableTeacher: {...teacher} });
    }

    editTeacherName = event => {
        let { editableTeacher } = this.state;
        editableTeacher.teacherName = event.target.value;
        this.setState({ editableTeacher });
    }

    editTeacherInitials = event => {
        let { editableTeacher } = this.state;
        editableTeacher.initials = event.target.value;
        this.setState({ editableTeacher });
    }

    saveTeacher = event => {
        event.preventDefault();

        this.setState({ loading: true });

        const { editableTeacher, teachers } = this.state;

        teacherService.updateTeacherInformation(editableTeacher.id, editableTeacher.teacherName, editableTeacher.initials)
        .then(() => {
            this.setState({ loading: false, show: false });
            let index = teachers.findIndex((teacher => teacher.id === editableTeacher.id));
            teachers[index] = editableTeacher;
            this.setState({ teachers });
        })
        .catch(error => {
            console.error(error);
        });
    }

    render() {

        const { teacherName, teachers,
            allSubjects, initials, teacherSubjects, show, editableTeacher } = this.state;

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
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Име на учитела</th>
                                <th>Инициали</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {teachers && teachers.map(teacher => (
                                    <tr key={teacher.id}>
                                        <td>{teacher.teacherName}</td>
                                        <td>{teacher.initials}</td>
                                        <Modal 
                                        show={show}
                                        onHide={() => this.setState({ show: !show })}
                                        centered
                                        >
                                            <Modal.Header closeButton>
                                                <Modal.Title>Променете името на Учителя</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <Form
                                                onSubmit={this.saveTeacher}
                                                ref={c => {
                                                    this.form = c;
                                                }}
                                                >
                                                    <FormGroup>
                                                        <FormBootstrap.Label htmlFor="initials">Име</FormBootstrap.Label>
                                                        <Input
                                                            type="text"
                                                            className="form-control"
                                                            name="editableTeacher"
                                                            value={editableTeacher.teacherName}
                                                            onChange={this.editTeacherName}
                                                        />
                                                    </FormGroup>

                                                    <FormGroup>
                                                        <FormBootstrap.Label htmlFor="initials">Инициали</FormBootstrap.Label>
                                                        <Input
                                                            type="texasfast"
                                                            className="form-control"
                                                            name="initials"
                                                            value={editableTeacher.initials}
                                                            onChange={this.editTeacherInitials}
                                                        />
                                                    </FormGroup>
                                                    
                                                    <FormGroup>
                                                        <Button
                                                            type="submit"
                                                            variant="success"
                                                            className="btn-block">
                                                                {this.state.loading &&
                                                                    <span className="spinner-border spinner-border-sm"></span>
                                                                }
                                                                <span>Запази</span>
                                                            </Button>
                                                    </FormGroup>
                                                </Form>
                                            </Modal.Body>
                                        </Modal>
                                        <td>
                                            <Button
                                            variant="warning"
                                            name={teacher.teacherName}
                                            onClick={this.onShow.bind(this, teacher)}
                                            >
                                                Промяна
                                            </Button>
                                        </td>
                                        <td>
                                            <Button
                                            variant="danger"
                                            name={teacher.id}
                                            onClick={this.deleteTeacher.bind(this, teacher)}
                                            >
                                                Изтриване
                                            </Button>
                                        </td>
                                    </tr>                 
                            ))}
                        </tbody>
                    </Table>
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