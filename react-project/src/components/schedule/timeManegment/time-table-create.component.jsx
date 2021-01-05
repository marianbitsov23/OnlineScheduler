import React, { Component } from 'react';

import { Container, Table, Button, Jumbotron, FormGroup } from 'react-bootstrap';
import FormBootstrap from 'react-bootstrap/Form';
import Input from "react-validation/build/input";
import Form from "react-validation/build/form";

export default class CreateTimeTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timeTableName: "",
            slots: []
        };

        this.saveSlot.bind(this);
        this.editSlot.bind(this);
        this.deleteSlot.bind(this);
        this.onChange.bind(this);
        this.saveTableName.bind(this);
    }

    componentDidMount() {
        
    }

    onChange = event => {
        event.preventDefault();

        this.setState({ [event.target.name] : event.target.value });
    }

    saveSlot = event => {
        event.preventDefault();
    }

    saveTableName = event => {
        event.preventDefault();
        
    }

    editSlot = event => {
        event.preventDefault();

    }

    deleteSlot = event => {
        event.preventDefault();
    }

    render() {

        const { slots, timeTableName } = this.state;

        const isInvalid = timeTableName === "";

        return(
            <>
                <Container>
                    <Jumbotron>
                        {timeTableName &&
                            <>
                                <h1>{timeTableName}</h1>

                                <Button
                                    variant="outline-secondary"
                                    onClick={() => {

                                    }}
                                >
                                        Edit Name
                                </Button>
                            </>
                        }

                        {!timeTableName &&
                        <Form
                            onSubmit={this.saveTableName}
                            ref={c => {
                                this.form = c;
                            }}
                        >
                            <FormGroup>
                                <FormBootstrap.Label htmlFor="timeTableName">Time table name</FormBootstrap.Label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    name="timeTableName"
                                    value={this.state.timeTableName}
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
                                            <span>Save table name</span>
                                        </Button>
                                </FormGroup>
                        </Form>}
                    </Jumbotron>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Monday</th>
                                <th>Tuesday</th>
                                <th>Wednesday</th>
                                <th>Thursday</th>
                                <th>Friday</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <Button
                                        variant="outline-info"
                                        onClick={this.saveSlot}
                                    >
                                        Add slot
                                    </Button>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </Container>
            </>
        )
    }
}