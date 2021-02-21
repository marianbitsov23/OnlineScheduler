import React, { Component } from 'react';
import { FormGroup, Button, Modal } from 'react-bootstrap';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import FormBootstrap from 'react-bootstrap/Form';
import Checkbox from '@material-ui/core/Checkbox';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import FormControlLabel from '@material-ui/core/FormControlLabel';

export default class TableList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false,
            editableElement: {},
            selectedTeacher: 0,
            selectedCabinet: 0,
            selectedTimeTable: 0
        };
    }

    saveElement = event => {
        event.preventDefault();

        const { editableElement, selectedTeacher, selectedCabinet } = this.state;
        let elements = this.props.elements;

        if(this.props.type === 'teaching-hour') {
            editableElement.teacher = this.props.teachers[selectedTeacher];
            editableElement.cabinet = this.props.cabinets[selectedCabinet];
        }

        this.props.service.update(editableElement)
        .then(() => {
            this.setState({ loading: false, show: false });
            let index = elements.findIndex((element => element.id === editableElement.id));
            elements[index] = editableElement;
            this.setState({ elements });
        })
        .catch(error => console.error(error));
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
        .catch(error => console.error(error));
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

    editHoursPerWeek = event => {
        let { editableElement } = this.state;
        editableElement.hoursPerWeek = event.target.value;
        this.setState({ editableElement });
    }

    handleCheck = event => {
        let { editableElement } = this.state;
        editableElement.overAWeek = event.target.checked;
        this.setState({ editableElement });
    }

    onChange = event => {
        event.preventDefault();
        this.setState({ [event.target.name] : event.target.value });
    }

    render() {

        const { show, editableElement } = this.state;
        const { teachers, cabinets } = this.props;
        const elements = this.props.elements;

        return(
            <>
            <TableContainer component={Paper} className="myDefaultMarginTopBottom">
                <Table>
                    <TableHead>
                        <TableRow>
                            {this.props.type !== "teaching-hour" && <TableCell>Име</TableCell>}
                            {this.props.type === "cabinet" && <TableCell>Категории</TableCell>}
                            {this.props.type === "teacher" && <TableCell>Инициали</TableCell>}
                            {this.props.type === "teaching-hour" && <TableCell>Група</TableCell>}
                            {this.props.type === "teaching-hour" && <TableCell>Преподавател</TableCell>}
                            {this.props.type === "teaching-hour" && <TableCell>Час / Седмица</TableCell>}
                            {this.props.type === "teaching-hour" && <TableCell>През седмица</TableCell>}
                            {this.props.type === "teaching-hour" && <TableCell>Кабинет</TableCell>}
                            {this.props.type === "teaching-hour" && <TableCell>Слотове</TableCell>}
                            <TableCell />
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {elements && elements.map(element => (
                            <TableRow key={element.id}>
                                {this.props.type !== "teaching-hour" && <TableCell>{element.name}</TableCell>}
                                {this.props.type === "teacher" && <TableCell>{element.initials}</TableCell>}
                                {this.props.type === "cabinet" && <TableCell>{element.cabinetCategories
                                && element.cabinetCategories.map(category => (
                                    <ul>
                                        <li key={category.id}>{category.name}</li>
                                    </ul>
                                ))}</TableCell>}
                                {this.props.type === "teaching-hour" && <TableCell>12A</TableCell>}
                                {this.props.type === "teaching-hour" && <TableCell>
                                    {element.teacher.name} ({element.teacher.initials})
                                </TableCell>}
                                {this.props.type === "teaching-hour" && <TableCell>
                                    {element.hoursPerWeek}
                                </TableCell>}
                                {this.props.type === "teaching-hour" && element.overAWeek && <TableCell>
                                    Да
                                </TableCell>}
                                {this.props.type === "teaching-hour" && !element.overAWeek && <TableCell>
                                    Не
                                </TableCell>}
                                {this.props.type === "teaching-hour" && <TableCell>
                                    {element.cabinet.name}
                                </TableCell>}
                                {this.props.type === "teaching-hour" && <TableCell>
                                    Брой: {element.timeSlots.length}
                                </TableCell>}
                                <TableCell>
                                    <Button
                                        variant="warning"
                                        name={element.name}
                                        onClick={this.onShow.bind(this, element)}
                                    >
                                        Промяна
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="danger"
                                        name={element.id}
                                        onClick={this.deleteElement.bind(this, element)}
                                    >
                                        Изтриване
                                    </Button>
                                </TableCell>
                            </TableRow>                 
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Modal
                size="lg"
                show={show}
                onHide={() => this.setState({ show: !show })}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Направете промяна</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={this.saveElement}>
                        {this.props.type !== "teaching-hour" &&
                        <FormGroup>
                            <Input
                                type="text"
                                className="form-control"
                                name="editableElement"
                                value={editableElement.name}
                                onChange={this.editElement}
                            />
                        </FormGroup>
                        }

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

                        {this.props.type === "teaching-hour" &&
                        <>
                            <FormGroup>
                                <FormBootstrap.Label>Променете учителя</FormBootstrap.Label>
                                <FormBootstrap.Control as="select" 
                                name="selectedTeacher"
                                value={this.state.selectedTeacher} 
                                onChange={this.onChange}>
                                    {teachers && teachers.map((teacher, index) => (
                                        <option key={teacher.id} value={index}>{teacher.name}</option>
                                    ))}
                                </FormBootstrap.Control>
                            </FormGroup>
                            <FormGroup>
                                <FormBootstrap.Label>Час / Седмица</FormBootstrap.Label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    name="initials"
                                    value={editableElement.hoursPerWeek}
                                    onChange={this.editHoursPerWeek}
                                />
                            </FormGroup>

                            <FormGroup>
                            <FormControlLabel
                                control={
                                <Checkbox 
                                    checked={editableElement.overAWeek} 
                                    onChange={this.handleCheck} 
                                    name="overAWeek" 
                                    color="primary"
                                />}
                                label="През седмица"
                            />
                            </FormGroup>
                            
                            <FormGroup>
                                <FormBootstrap.Label>Променете кабинета</FormBootstrap.Label>
                                <FormBootstrap.Control as="select" 
                                name="selectedCabinet" 
                                value={this.state.selectedCabinet} 
                                onChange={this.onChange}>
                                    {cabinets && cabinets.map((cabinet, index) => (
                                        <option key={cabinet.id} value={index}>{cabinet.name}</option>
                                    ))}
                                </FormBootstrap.Control>
                            </FormGroup>
                        </>
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
            </>
        )
    }
}