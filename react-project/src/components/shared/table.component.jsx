import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { DeleteButton } from "../shared/custom-buttons/delete-button.component";
import { EditButton } from './custom-buttons/edit-button.component';
import { CustomDialog } from './custom-dialog.component';
import { EditInformationComponent } from './edit-information.component';

export default class TableList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false,
            editableElement: {},
            selectedTeacher: 0,
            selectedCabinet: 0,
            selectedTimeTable: 0,
            selectedElement: 0,
            selectedGroup: 0,
            remove: false
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

    deleteElement = () => {
        let elements = this.props.elements;
        const { editableElement } = this.state;
        
        this.props.service.delete(editableElement.id)
        .then(() => {
            elements.splice(elements.indexOf(editableElement), 1);
            this.setState({ elements, show: false });
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
                                    Все още няма въведена информация
                                </TableCell>
                            </TableRow>
                        }
                        {elements && elements.map((element, index) => (
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
                                        onClick={() => {
                                            this.onShow(element);
                                            this.setState({ remove: false })
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <DeleteButton
                                        text="Изтриване"
                                        onClick={() => {
                                            this.onShow(element);
                                            this.setState({ remove: true })
                                        }}
                                    />                          
                                </TableCell>
                            </TableRow>                 
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <CustomDialog
                    show={show}
                    danger={this.state.remove}
                    onClose={() => this.setState({ show: !show })}
                    title={this.state.remove ? "Изтриване на елемент" : "Изберете часове"}
                    confirmFunction={this.state.remove ? this.deleteElement : this.saveElement}
                    confirmButtonText={this.state.remove ? "Изтриване" : "Запази"}
                    text=
                    {this.state.remove ? <>
                        Напълно сигурни ли сте, че искате да изтриете елемента <span className="scheduleName">
                            {editableElement.name}</span> ?
                        При изтриването му, ще се изтрият всички други данни, свързани с него! 
                        Ако сте съгласни натиснете бутона <span className="deleteButtonText">Изтриване</span>, за да потвърдите.
                    </>
                    : <>
                        Променяте елемент <span className="scheduleName">{editableElement.name}</span>.
                    </>
                    }
                    content={
                        <EditInformationComponent
                            editableElement={editableElement}
                            selectedGroup={this.state.selectedGroup}
                            groups={groups}
                            editElement={this.editElement}
                            editTeacherInitials={this.editTeacherInitials}
                            onChange={this.onChange}
                            selectedTeacher={this.state.selectedTeacher}
                            teachers={teachers}
                            editHoursPerWeek={this.editHoursPerWeek}
                            handleCheck={this.handleCheck}
                            selectedCabinet={this.state.selectedCabinet}
                            cabinets={cabinets}
                            type={this.props.type}
                            remove={this.state.remove}
                        />
                    }
                />
            </>
        )
    }
}