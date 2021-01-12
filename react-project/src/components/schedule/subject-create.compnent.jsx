import React, { Component } from 'react';
import { Container, Card, FormGroup, Button, Table, Modal } from 'react-bootstrap';
import FormBootstrap from 'react-bootstrap/Form';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import scheduleService from '../../services/schedule/schedule.service';
import subjectService from '../../services/schedule/subject.service';

export default class CreateSubject extends Component {
    constructor(props) {
        super(props);

        this.state = {
            subjectName: "",
            loading: false,
            subjects: [],
            editableSubject: {},
            show: false,
            schedule: scheduleService.getCurrentSchedule()
        };

        this.createSubject.bind(this);
        this.editSubject.bind(this);
        this.deleteSubject.bind(this);
        this.onShow.bind(this);
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
    

    createSubject = event => {
        event.preventDefault();

        this.setState({ loading: true });

        const { subjectName, schedule } = this.state;

        //TODO: fix saving duplicate subjects

        subjectService.createSubject(subjectName, schedule)
        .then(result => {
            this.state.subjects.push(result.data);
            this.setState({ subjectName: "", loading: false });
        })
        .catch(error => {
            console.error(error);
        });
    }

    deleteSubject = subject => {
        let { subjects } = this.state;

        subjectService.deleteSubject(subject.id)
        .then(() => {
            subjects.splice(subjects.indexOf(subject), 1);
            this.setState({ subjects });
        })
        .catch(error => {
            console.error(error);
        });
    }

    saveSubject = event => {
        event.preventDefault();

        this.setState({ loading: true });

        const { editableSubject } = this.state;

        subjectService.updateSubjectInformation(editableSubject.id, editableSubject.subjectName, editableSubject.schedule, null)
        .then(() => {
            this.setState({ loading: false, show: false });
        })
        .catch(error => {
            console.error(error);
        });
    }

    onShow = subject => {
        this.setState({ show: !this.state.show, editableSubject: subject });
    }

    onChange = event => {
        event.preventDefault();
        this.setState({ [event.target.name] : event.target.value });
    }

    editSubject = event => {
        let { editableSubject } = this.state;
        editableSubject.subjectName = event.target.value;
        this.setState({ editableSubject });
    }

    render() {

        const { subjectName, subjects, show, editableSubject} = this.state;

        const isInvalid = subjectName === "";

        return(
            <>
                <Container>
                    <Card>
                        <Card.Header>Добави нов предмет</Card.Header>
                        <Card.Body>
                            <Form
                                onSubmit={this.createSubject}
                                ref={c => {
                                    this.form = c;
                                }}
                            >
                                <FormGroup>
                                    <FormBootstrap.Label htmlFor="subjectName">Име на предмета</FormBootstrap.Label>
                                    <Input
                                        className="form-control"
                                        name="subjectName"
                                        value={this.state.subjectName}
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
                                <th>Име на предмета</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjects.map(subject => (
                                    <tr key={subject.id}>
                                        <td>{subject.subjectName}</td>
                                        <Modal 
                                        show={show}
                                        onHide={() => this.setState({ show: !show })}
                                        centered
                                        >
                                            <Modal.Header closeButton>
                                                <Modal.Title>Променете името на предмета</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <Form
                                                onSubmit={this.saveSubject}
                                                ref={c => {
                                                    this.form = c;
                                                }}
                                                >
                                                    <FormGroup>
                                                        <Input
                                                            type="text"
                                                            className="form-control"
                                                            name="editableSubject"
                                                            value={editableSubject.subjectName}
                                                            onChange={this.editSubject}
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
                                            name={subject.subjectName}
                                            onClick={this.onShow.bind(this, subject)}
                                            >
                                                Промяна
                                            </Button>
                                        </td>
                                        <td>
                                            <Button
                                            variant="danger"
                                            name={subject.id}
                                            onClick={this.deleteSubject.bind(this, subject)}
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