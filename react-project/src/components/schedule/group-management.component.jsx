import React, { Component } from 'react';
import { Container, Jumbotron, FormGroup, Modal } from 'react-bootstrap';
import FormBootstrap from 'react-bootstrap/Form';
import Form from "react-validation/build/form";
import groupService from '../../services/schedule/group.service';
import scheduleService from '../../services/schedule/schedule.service';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import GroupIcon from '@material-ui/icons/Group';
import { TextField, Button, List, Collapse,
    ListItem, ListItemIcon, ListItemText } from '@material-ui/core';


export default class ManageGroups extends Component {
    constructor(props) {
        super(props);

        this.state = {
            groupName: "",
            groups: undefined,
            parent: {},
            groupRows: 2,
            classNames: [],
            openBoxes: [],
            selectedClass: 0,
            schedule: scheduleService.getCurrentSchedule(),
            show: false,
            edit: true
        };

        this.addGroup.bind(this);
        this.saveGroups.bind(this);
    }

    componentDidMount() {
        // load already created groups for this schedule
        groupService.getAllGroupsByScheduleId(this.state.schedule.id)
        .then(result => {
            console.log(result.data);

            const schoolType = this.state.schedule.schoolType;

            const yearClasses = schoolType === "MIDDLESCHOOL" 
                ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
                : [0, 1, 2, 3, 4];

            let classNames = [];
            let openBoxes = [];
            let groups = new Map();

            yearClasses.forEach(yearClass => {
                classNames.push(" ");
                openBoxes.push(false);
                groups.set(yearClass, []);
            });

            this.setState({ classNames, yearClasses, openBoxes, groups });
        })
        .catch(error => console.error(error));
    }

    addGroup = event => {
        event.preventDefault();
        const { groupName, parent, schedule, groups, selectedClass } = this.state; 

        groupService.createGroup(parent, groupName, null, schedule)
        .then(result => {
            groups.set(selectedClass, result.data);
        })
        .catch(error => console.error(error));
    }

    saveGroups = event => {
        event.preventDefault();
        const { parent, classNames, schedule } = this.state;

        classNames.forEach(className => {
            groupService.createGroup(parent, className, null, schedule)
            .then(() => {
                this.setState({ edit: false });
            })
            .catch(error => console.error(error));
        }); 
    }

    classChange = event => {
        const { classNames } = this.state;

        classNames[parseInt(event.target.name)] = event.target.value;

        this.setState({ classNames });
    }

    onChange = event => this.setState({ [event.target.name]: event.target.value }); 

    handleOpen = (index) => {
        let openBoxes = this.state.openBoxes;
        openBoxes[index] = !openBoxes[index];

        this.setState({ openBoxes });
    }

    render() {
        const { 
            groupName, 
            yearClasses, 
            show, 
            openBoxes, 
            classNames,
            edit,
            groups
        } = this.state;

        const isInvalid = groupName === "";
 
        return(
            <>
                <Container>
                    <Jumbotron>
                        {edit &&
                        <>
                            <h1 className="myTextAlignCenter myFontFamily">
                                Въведете имената на випуските
                            </h1>
                            {yearClasses && yearClasses.map(yearClass => (
                                <FormGroup key={yearClass}>
                                    <TextField
                                        label="Име на випуска"
                                        placeholder="Въведете името на випуска"
                                        fullWidth
                                        name={yearClass.toString()}
                                        margin="normal"
                                        value={classNames[yearClass]}
                                        onChange={this.classChange}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </FormGroup>
                            ))}
                            <FormGroup>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    className="btn-block"
                                    onClick={this.saveGroups}
                                >
                                    {this.state.loading &&
                                        <span className="spinner-border spinner-border-sm"></span>
                                    }
                                    <span>Запазване</span>
                                </Button>
                            </FormGroup>
                        </>
                        }{!edit && 
                            <>
                                <h1 className="myTextAlignCenter myFontFamily">
                                    Запазване на випуски
                                </h1>
                                <List>
                                    {classNames.map((className, index) => (
                                        <div key={index}>
                                            <ListItem button onClick={this.handleOpen.bind(this, index)}>
                                                <ListItemIcon>
                                                    <GroupIcon />
                                                </ListItemIcon>
                                                <ListItemText primary={"Випуск: " + className} />
                                                {openBoxes[index] ? <ExpandLess /> : <ExpandMore />}
                                            </ListItem>
                                            <Collapse in={openBoxes[index]} timeout="auto" unmountOnExit>
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={() => this.setState({ show: !show, selectedClass: index })}
                                                >
                                                    Добави клас
                                                </Button>
                                            </Collapse>
                                        </div>
                                    ))}
                                </List>
                                <FormGroup>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className="btn-block"
                                        onClick={() => this.setState({ edit: true })}
                                    >
                                        {this.state.loading &&
                                            <span className="spinner-border spinner-border-sm"></span>
                                        }
                                        <span>Редактиране</span>
                                    </Button>
                                </FormGroup>
                            </>
                        }
                    </Jumbotron>
                </Container>
                <Modal 
                    show={show} 
                    onHide={() => this.setState({ show: false })}
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Въведете името на класа</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form
                            onSubmit={this.addGroup}
                        >
                            <FormGroup>
                                <TextField
                                    label="Име на групата"
                                    placeholder="Въведете името на групата"
                                    fullWidth
                                    name="groupName"
                                    margin="normal"
                                    value={groupName}
                                    onChange={this.onChange}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </FormGroup>   
                            <FormGroup>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                    disabled={isInvalid}
                                >
                                    {this.state.loading &&
                                        <span className="spinner-border spinner-border-sm"></span>
                                    }
                                    <span>Добави група</span>
                                </Button>
                            </FormGroup>
                        </Form>
                    </Modal.Body>
                </Modal>
            </>
        );
    }
}