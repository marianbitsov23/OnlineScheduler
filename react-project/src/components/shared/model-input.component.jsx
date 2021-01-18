import React, { Component } from 'react';
import scheduleService from '../../services/schedule/schedule.service';
import TableList from '../shared/table.component';
import { Container, Card, FormGroup, Button } from 'react-bootstrap';
import FormBootstrap from 'react-bootstrap/Form';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CategorySelect from './category-select.component';

export default class ModelInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            elementName: "",
            initials: "",
            loading: false,
            schedule: scheduleService.getCurrentSchedule()
        };

    }

    onChange = event => {
        event.preventDefault();

        this.setState({ [event.target.name] : event.target.value });
    }

    createElement = event => {
        event.preventDefault();

        this.setState({ loading: true });

        const { elementName, schedule, initials } = this.state;

        const service = this.props.service;

        //TODO: fix saving duplicate elements

        let element = undefined;

        switch(this.props.type) {
            case "subject": 
                element = { name: elementName, schedule: schedule };
                break;
            case "teacher":
                element = { name: elementName, initials: initials, schedule: schedule };
                break;
            case "cabinet":
                element = { name: elementName, 
                    categories: JSON.parse(localStorage.getItem("categories")),
                    schedule: schedule
                };
                break;
            default:
                break;
        }

        service.create(element)
        .then(result => {
            this.props.elements.push(result.data);
            localStorage.setItem("categories", JSON.stringify([]));
            this.setState({ elementName: "", initials: "", loading: false });
        })
        .catch(error => {
            console.error(error);
        });
    }

    render() {

        const { elementName } = this.state;
        const service = this.props.service;
        const isInvalid = elementName === "";

        return(
            <>
                <Container>
                    <Card>
                    {this.props.type === "teacher" && <Card.Header>Добави нов учител</Card.Header>}
                    {this.props.type === "subject" && <Card.Header>Добави нов предмет</Card.Header>}
                    {this.props.type === "cabinet" && <Card.Header>Добави нов кабинет</Card.Header>}
                        <Card.Body>
                            <Form
                                onSubmit={this.createElement}
                                ref={c => {
                                    this.form = c;
                                }}
                            >
                                <FormGroup>
                                    {this.props.type === "teacher" && 
                                        <FormBootstrap.Label htmlFor="elementName">Име на учителя</FormBootstrap.Label>
                                    }
                                    {this.props.type === "subject" && 
                                        <FormBootstrap.Label htmlFor="elementName">Име на предмета</FormBootstrap.Label>
                                    }
                                    {this.props.type === "cabinet" && 
                                        <FormBootstrap.Label htmlFor="elementName">Име на кабинета</FormBootstrap.Label>
                                    }
                                    <Input
                                        className="form-control"
                                        name="elementName"
                                        value={this.state.elementName}
                                        onChange={this.onChange}
                                    />
                                </FormGroup>
                                
                                {this.props.type === "cabinet" && 
                                    <CategorySelect 
                                        cabinetName={this.state.elementName} 
                                        schedule={this.state.schedule} 
                                        categories={this.props.categories} 
                                    />
                                }

                                {this.props.type === "teacher" && 
                                <FormGroup>
                                    <FormBootstrap.Label htmlFor="initials">Инициали</FormBootstrap.Label>
                                    <Input
                                        className="form-control"
                                        name="initials"
                                        value={this.state.initials}
                                        onChange={this.onChange}
                                    />
                                </FormGroup>}

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
                    <TableList type={this.props.type} elements={this.props.elements} service={service} />
                </Container>
            </>
        );
    }
}