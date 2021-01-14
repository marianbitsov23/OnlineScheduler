import React, { Component } from 'react';
import cabinetService from '../../services/schedule/cabinet/cabinet.service';
import subjectService from '../../services/schedule/subject.service';
import teacherService from '../../services/schedule/teacher.service';
import authService from '../../services/user-auth/auth.service';
import { Container, Card, FormGroup, Button, Table, Modal } from 'react-bootstrap';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";

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

        console.log(elements);

        return(
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Име</th>
                        {this.props.type === "кабинета" && <th>Категории</th>}
                        {this.props.type === "учителя" && <th>Инициали</th>}
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {elements && elements.map(element => (
                            <tr key={element.id}>
                                <td>{element.name}</td>
                                {this.props.type === "учителя" && <td>{element.initials}</td>}
                                {this.props.type === "кабинета" && <td>{element.cabinetCategories
                                && element.cabinetCategories.map(category => (
                                    <ul>
                                        <li key={category.id}>{category.name}</li>
                                    </ul>
                                ))}</td>}
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

                                            {this.props.type === "учителя" && 
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