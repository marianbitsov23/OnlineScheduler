import React, { Component } from 'react';
import { Container, Card, FormGroup, Button } from 'react-bootstrap';
import FormBootstrap from 'react-bootstrap/Form';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import cabinetService from '../../services/cabinet.service';

export default class CreateCabinet extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cabinetName: "",
            specialCabinet: false,
            loading: false,
            cabinets: []
        };

        this.saveCabinet.bind(this);
    }

    saveCabinet = event => {
        event.preventDefault();

        this.setState({ loading: true });

        const { cabinetName, specialCabinet } = this.state;

        cabinetService.createCabinet(cabinetName, specialCabinet)
        .then(result => {
            this.state.cabinets.push(result);
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

        const isInvalid = this.state.cabinetName === "";

        return(
            <>
                <Container>
                    <Card>
                        <Card.Header>Add cabinets</Card.Header>
                        <Card.Body>
                            <Form
                                onSubmit={this.saveCabinet}
                                ref={c => {
                                    this.form = c;
                                }}
                            >
                                <FormGroup>
                                    <FormBootstrap.Label htmlFor="cabinetName">Cabinet number</FormBootstrap.Label>
                                    <Input
                                        type="number"
                                        className="form-control"
                                        name="cabinetName"
                                        value={this.state.cabinetName}
                                        onChange={this.onChange}
                                    />
                                </FormGroup>
                                
                                <FormGroup>
                                    <FormBootstrap.Label htmlFor="session">
                                        Is this a special cabinet
                                    </FormBootstrap.Label>
                                    <select name="specialCabinet" 
                                    value={this.state.specialCabinet} 
                                    onChange={this.onChange}>
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
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
                                            <span>Save Cabinet</span>
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