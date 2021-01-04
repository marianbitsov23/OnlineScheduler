import React, { Component } from 'react';
import { Container, Card, FormGroup, Button } from 'react-bootstrap';
import FormBootstrap from 'react-bootstrap/Form';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import subjectService from '../../services/subject.service';

export default class CreateSubject extends Component {
    constructor(props) {
        super(props);

        this.state = {
            subjectName: "",
            loading: false,
            subjects: []
        };

        this.saveSubject.bind(this);
    }

    componentDidMount() {
        subjectService.getAllSubjects()
        .then(result => {
            this.state.subjects = result.data;
            this.setState({});
        })
        .catch(error => {
            console.error(error);
        })
    }
    

    saveSubject = event => {
        event.preventDefault();

        this.setState({ loading: true });

        const { subjectName } = this.state;

        //TODO: fix saving duplicate subjects

        subjectService.createSubject(subjectName)
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
                    <h2> Subjects : </h2>
                    {subjects.map(subject => (
                        <p key={subject.id}> {subject.subjectName} </p>
                    ))}
                </Container>

                <Container>
                    <Card>
                        <Card.Header>Add Subject</Card.Header>
                        <Card.Body>
                            <Form
                                onSubmit={this.saveSubject}
                                ref={c => {
                                    this.form = c;
                                }}
                            >
                                <FormGroup>
                                    <FormBootstrap.Label htmlFor="subjectName">Subject name</FormBootstrap.Label>
                                    <Input
                                        type="texasfast"
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
                                            <span>Save Subject</span>
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