import React, { Component } from 'react';
import { FormGroup, Button, Table, Modal } from 'react-bootstrap';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import timeSlotService from '../../services/schedule/timeManegment/time-slot.service';

export default class TableList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false,
            editableElement: {}
        };

    }

    saveElement = event => {
        event.preventDefault();

        const { editableElement } = this.state;
        let elements = this.props.elements;

        this.props.service.update(editableElement)
        .then(() => {
            this.setState({ loading: false, show: false });
            let index = elements.findIndex((element => element.id === editableElement.id));
            elements[index] = editableElement;
            this.setState({ elements });
        })
        .catch(error => {
            console.error(error);
        });
    }

    onShow = element => {
        this.setState({ show: !this.state.show, editableElement: {...element} });
    }

    deleteElement = (element) => {
        let elements = this.props.elements;
        
        this.props.service.delete(element.id)
        .then(() => {
            elements.splice(elements.indexOf(element), 1);
            this.setState({ elements });
        })
        .catch(error => {
            console.error(error);
        });
    }

    editElement = event => {
        let { editableElement } = this.state;
        editableElement.name = event.target.value;
        this.setState({ editableElement });
    }

    editTeacherInitials = event => {
        let { editableElement } = this.state;
        editableElement.initials = event.target.value;
        this.setState({ editableElement });
    }

    render() {

        const { show, editableElement } = this.state;
        const elements = this.props.elements;

        return(
            <Table striped bordered hover>
                <thead>
                    <tr>
                        {this.props.type !== "teaching-hour" && <th>Име</th>}
                        {this.props.type === "cabinet" && <th>Категории</th>}
                        {this.props.type === "teacher" && <th>Инициали</th>}
                        {this.props.type === "teaching-hour" && <th>Група</th>}
                        {this.props.type === "teaching-hour" && <th>Преподавател</th>}
                        {this.props.type === "teaching-hour" && <th>Час / Седмица</th>}
                        {this.props.type === "teaching-hour" && <th>Кабинет</th>}
                        {this.props.type === "teaching-hour" && <th>Слотове</th>}
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {elements && elements.map(element => (
                            <tr key={element.id}>
                                {this.props.type !== "teaching-hour" && <td>{element.name}</td>}
                                {this.props.type === "teacher" && <td>{element.initials}</td>}
                                {this.props.type === "cabinet" && <td>{element.cabinetCategories
                                && element.cabinetCategories.map(category => (
                                    <ul>
                                        <li key={category.id}>{category.name}</li>
                                    </ul>
                                ))}</td>}
                                {this.props.type === "teaching-hour" && <th>12A</th>}
                                {this.props.type === "teaching-hour" && <th>{element.teacher.name} ({element.teacher.initials})</th>}
                                {this.props.type === "teaching-hour" && <th>{element.hoursPerWeek}</th>}
                                {this.props.type === "teaching-hour" && <th>{element.cabinet.name}</th>}
                                {this.props.type === "teaching-hour" && <th>Брой: {element.timeSlots.length}</th>}
                                <Modal 
                                show={show}
                                onHide={() => this.setState({ show: !show })}
                                centered
                                >
                                    <Modal.Header closeButton>
                                        <Modal.Title>Направете промяна</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <Form
                                        onSubmit={this.saveElement}
                                        ref={c => {
                                            this.form = c;
                                        }}
                                        >
                                            <FormGroup>
                                                <Input
                                                    type="text"
                                                    className="form-control"
                                                    name="editableElement"
                                                    value={editableElement.name}
                                                    onChange={this.editElement}
                                                />
                                            </FormGroup>

                                            {this.props.type === "teacher" && 
                                                <FormGroup>
                                                    <Input
                                                        type="text"
                                                        className="form-control"
                                                        name="initials"
                                                        value={editableElement.initials}
                                                        onChange={this.editTeacherInitials}
                                                    />
                                                </FormGroup>
                                            }

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
                                    name={element.name}
                                    onClick={this.onShow.bind(this, element)}
                                    >
                                        Промяна
                                    </Button>
                                </td>
                                <td>
                                    <Button
                                    variant="danger"
                                    name={element.id}
                                    onClick={this.deleteElement.bind(this, element)}
                                    >
                                        Изтриване
                                    </Button>
                                </td>
                            </tr>                 
                    ))}
                </tbody>
            </Table>
        )
    }
}