import React, { Component } from 'react';
import { Container, Card, FormGroup, Button, Table, Modal } from 'react-bootstrap';
import FormBootstrap from 'react-bootstrap/Form';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import cabinetCategoryService from '../../services/schedule/cabinet/cabinet-category.service';
import cabinetService from '../../services/schedule/cabinet/cabinet.service';
import scheduleService from '../../services/schedule/schedule.service';
import TableList from '../shared/table.component';

export default class CreateCabinet extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cabinetName: "",
            loading: false,
            cabinets: [],
            categories: [],
            schedule: scheduleService.getCurrentSchedule()
        };

        this.createCabinet.bind(this);
    }

    componentDidMount() {
        cabinetService.getAllCabinets()
        .then(result => {
            this.setState({ cabinets: result.data });
        })
        .then(() => {
            cabinetCategoryService.getAllCabinetCategories()
            .then(result => {
                this.setState({ categories: result.data });
            });
        })
        .catch(error => {
            console.error(error);
        })
    }
    

    createCabinet = event => {
        event.preventDefault();

        this.setState({ loading: true });

        const { cabinetName, categories, schedule } = this.state;

        //TODO: fix saving duplicate cabinets

        cabinetService.createCabinet(cabinetName, categories, schedule)
        .then(result => {
            this.state.cabinets.push(result.data);
            this.setState({ cabinetName: "", loading: false });
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

        const { cabinetName, cabinets, categories } = this.state;

        const isInvalid = cabinetName === "";

        return(
            <>
                <Container>
                    <Card>
                        <Card.Header>Add cabinets</Card.Header>
                        <Card.Body>
                            <Form
                                onSubmit={this.createCabinet}
                                ref={c => {
                                    this.form = c;
                                }}
                            >
                                <FormGroup>
                                    <FormBootstrap.Label htmlFor="cabinetName">Cabinet number</FormBootstrap.Label>
                                    <Input
                                        type="text"
                                        className="form-control"
                                        name="cabinetName"
                                        value={this.state.cabinetName}
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
                <hr />
                <Container>
                    <TableList type="кабинета" elements={cabinets} service={cabinetService} />
                </Container>
            </>
        );
    }
}