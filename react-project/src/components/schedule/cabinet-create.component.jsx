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
            cabinetCategories: [],
            categoryName: "",
            show: false,
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

        const { cabinetName, cabinetCategories, schedule } = this.state;

        //TODO: fix saving duplicate cabinets

        cabinetService.createCabinet(cabinetName, cabinetCategories, schedule)
        .then(result => {
            this.state.cabinets.push(result.data);
            this.setState({ cabinetName: "", loading: false, cabinetCategories: [] });
        })
        .catch(error => {
            console.error(error);
        });
    }

    createCategory = event => {
        event.preventDefault();

        const { categoryName, schedule } = this.state;

        cabinetCategoryService.createCabinetCategory(categoryName, schedule)
        .then(result => {
            this.state.categories.push(result.data);
            this.setState({ categoryName: "" });
        })
        .catch(error => {
            console.error(error);
        })
    }

    onChange = event => {
        event.preventDefault();

        this.setState({ [event.target.name] : event.target.value });
    }

    render() {

        const { show, cabinetName, cabinets, categories, cabinetCategories, categoryName } = this.state;

        const isInvalid = cabinetName === "";

        return(
            <>
                <Container>
                    <Card>
                        <Card.Header>Добави кабинет</Card.Header>
                        <Card.Body>
                            <Form
                                onSubmit={this.createCabinet}
                                ref={c => {
                                    this.form = c;
                                }}
                            >
                                <FormGroup>
                                    <FormBootstrap.Label htmlFor="cabinetName">Име / Номер на кабинета</FormBootstrap.Label>
                                    <Input
                                        type="text"
                                        className="form-control"
                                        name="cabinetName"
                                        value={this.state.cabinetName}
                                        onChange={this.onChange}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <FormBootstrap.Label htmlFor="subjects">
                                        Изберете категория на кабинета
                                    </FormBootstrap.Label>
                                    {(categories.map(category => {
                                        if(cabinetCategories.includes(category)) {
                                            return (
                                                <Container key={category.id}>
                                                    <p>
                                                        {category.name}
                                                    </p>
                                                    <Button
                                                        key={category.id}
                                                        variant="outline-danger"
                                                        //TODO: Find a way to extract it
                                                        onClick={() => {
                                                            let newCategories = cabinetCategories;
                                                            newCategories.splice(newCategories.indexOf(category), 1);

                                                            this.setState({ cabinetCategories: newCategories });
                                                        }}
                                                    >Премахни</Button>
                                                </Container>
                                            )
                                        } else {
                                            return(
                                                <>
                                                    <p key={category.id}>
                                                        {category.name}
                                                    </p>
                                                    <Button
                                                        key={category.id / 2}
                                                        variant="outline-info"
                                                        //TODO: Find a way to extract it
                                                        onClick={() => {
                                                            let newCategories = cabinetCategories;
                                                            newCategories.push(category);
                                                            this.setState({ cabinetCategories: newCategories });
                                                        }}
                                                    >Добави</Button>
                                                </>
                                            )
                                        }
                                    }))}
                                    <Container>
                                        <Button onClick={() => this.setState({ show: !this.state.show})}>
                                            Добави нова категория
                                        </Button>
                                    </Container>
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
                            <Modal 
                                    show={show}
                                    onHide={() => this.setState({ show: !show })}
                                    centered
                                    >
                                        <Modal.Header closeButton>
                                            <Modal.Title>Доабви нова категория</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <Form
                                            onSubmit={this.createCategory}
                                            ref={c => {
                                                this.form = c;
                                            }}
                                            >
                                                <FormGroup>
                                                    <Input
                                                        type="text"
                                                        className="form-control"
                                                        name="categoryName"
                                                        value={categoryName}
                                                        onChange={this.onChange}
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
                                                            <span>Добави</span>
                                                        </Button>
                                                </FormGroup>
                                            </Form>
                                        </Modal.Body>
                                    </Modal>
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