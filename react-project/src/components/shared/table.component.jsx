import React, { Component } from 'react';
import { FormGroup, Button, Modal } from 'react-bootstrap';
import Checkbox from '@material-ui/core/Checkbox';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { DeleteButton } from "../shared/custom-buttons/delete-button.component";
import { EditButton } from './custom-buttons/edit-button.component';
import { CustomDialog } from './custom-dialog.component';
import { TextInput } from './text-input.component';
import { CustomSelect } from './custom-select.component';

export default class TableList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false,
            editableElement: {},
            selectedTeacher: 0,
            selectedCabinet: 0,
            selectedTimeTable: 0,
            selectedGroup: 0
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

    onShow = element => this.setState({ show: !this.state.show, editableElement: {...element} });

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

    onChange = event => this.setState({ [event.target.name] : event.target.value });

    render() {

        const { show, editableElement } = this.state;
        const { teachers, cabinets, groups } = this.props;
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
                        {elements.length === 0 && 
                            <TableRow>
                                <TableCell>
                                    Все още няма нищо тук :(
                                </TableCell>
                            </TableRow>
                        }
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
                                {this.props.type === "teaching-hour" && <TableCell>{element.group.name}</TableCell>}
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
                                    <EditButton
                                        text="Промяна"
                                        onClick={this.onShow.bind(this, element)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <DeleteButton
                                        text="Изтриване"
                                        onClick={this.deleteElement.bind(this, element)}
                                    />                          
                                </TableCell>
                            </TableRow>                 
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <CustomDialog
                    show={show}
                    onClose={() => this.setState({ show: !show })}
                    title="Изберете часове"
                    confirmFunction={this.saveElement}
                    confirmButtonText="Запази"
                    content={
                        <>
                            {this.props.type !== "teaching-hour" &&
                            <TextInput
                                name="editableElement"
                                type="text"
                                max="35"
                                value={editableElement.name}
                                onChange={this.editElement}
                            />
                            }

                            {this.props.type === "teacher" && 
                            <TextInput
                                name="initials"
                                type="text"
                                max="35"
                                value={editableElement.initials}
                                onChange={this.editTeacherInitials}
                            />
                            }

                            {this.props.type === "teaching-hour" &&
                            <>
                                <CustomSelect
                                    label="Промяна на групата"
                                    name="selectedGroup"
                                    value={this.state.selectedGroup}
                                    onChange={this.onChange}
                                    elements={groups}
                                />

                                <CustomSelect
                                    label="Промяна на учител"
                                    name="selectedTeacher"
                                    value={this.state.selectedTeacher}
                                    onChange={this.onChange}
                                    elements={teachers}
                                />

                                <TextInput
                                    label="Час/седмица"
                                    name="hoursPerWeek"
                                    type="number"
                                    max="35"
                                    value={editableElement.hoursPerWeek}
                                    onChange={this.editHoursPerWeek}
                                />

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

                                <CustomSelect
                                    label="Промяна на кабинет"
                                    name="selectedCabinet"
                                    value={this.state.selectedCabinet}
                                    onChange={this.onChange}
                                    elements={cabinets}
                                />
                            </>
                            }
                        </>
                    }
                />
            </>
        )
    }
}