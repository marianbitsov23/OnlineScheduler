import React, { Component } from 'react';
import { Container, Card, FormGroup, Button, Table, Modal } from 'react-bootstrap';
import FormBootstrap from 'react-bootstrap/Form';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import scheduleService from '../../services/schedule/schedule.service';
import subjectService from '../../services/schedule/subject.service';
import TableList from '../shared/table.component';

export default class CreateSubject extends Component {
    constructor(props) {
        super(props);

        this.state = {
            subjectName: "",
            loading: false,
            subjects: [],
            schedule: scheduleService.getCurrentSchedule()
        };

        this.createSubject.bind(this);
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

    onChange = event => {
        event.preventDefault();
        this.setState({ [event.target.name] : event.target.value });
    }

    render() {

        const { subjectName, subjects} = this.state;

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
                    <TableList type="предмета" elements={subjects} service={subjectService} />
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