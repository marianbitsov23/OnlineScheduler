import React, { Component } from 'react';
import { Container, Jumbotron, FormGroup, Modal } from 'react-bootstrap';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
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
            parent: {},
            groups: [],
            classNames: [],
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
        groupService.getAllByScheduleId(this.state.schedule.id)
        .then(result => {
            const schoolType = this.state.schedule.schoolType;

            const parent = result.data.find(group => group.parent === null);

            console.log(parent)

            if(result.data.length > 1) {
                this.fetchGroupsByType(parent)
                .then(groups => {
                    this.setState({ groups: groups });
                });

                this.setState({ edit: false });
            } else {
                const yearGroupsAmmount = schoolType === "MIDDLESCHOOL" 
                    ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
                    : [0, 1, 2, 3, 4];
    
                const groups = this.state.groups;

                const classNames = [];
    
                yearGroupsAmmount.forEach(() => {
                    classNames.push(" ");
                    groups.set('yearGroup', []);
                });
    
                this.setState({ classNames, yearGroupsAmmount, parent, groups });
            }
        })
        .catch(error => console.error(error));
    }

    fetchGroupsByType = async (parent) => {

        return groupService.getAllByParentId(parent.id)
        .then(result => {
            result.data = this.mapOpenBoxes(result.data);
            result.data = this.fetchChildren(result.data);
            return result.data;
        })
        .catch(error => console.error(error));
    }

    fetchChildren = groups => {
        groups.forEach(group => {
            this.getGroupByParentId(group.id)
            .then(children => {
                if(children) {
                    group.children = children;
                    this.fetchChildren(children);
                } else {
                    group.children = [];
                }
            })
        });

        return groups;
    }

    getGroupByParentId = async (parentId) => {
        return groupService.getAllByParentId(parentId)
        .then(result => {
            return result.data;
        })
        .catch(error => {
            console.error(error); 
            return undefined;
        });

    }

    addGroup = event => {
        const { groupName, schedule, groups, selectedClass } = this.state; 

        const selectedGroup = groups[selectedClass];

        groupService.create({ parent: selectedGroup, groupName: groupName, schedule: schedule })
        .then(result => {
            groups[selectedClass].children.push(result.data);

            this.setState({ groups, groupName: '', show: false });
        })
        .catch(error => console.error(error));
    }

    mapOpenBoxes = groups => {
        groups.forEach(group =>{
            group.open = false;
        })

        return groups;
    }

    saveGroups = event => {
        event.preventDefault();
        const { parent, classNames, schedule, groups } = this.state;

        let yearGroups = []
        classNames.forEach(className => {
            groupService.create({ parent: parent, groupName: className, schedule: schedule })
            .then(result => {
                yearGroups.push(result.data);
            })
            .then(() => {
                if(yearGroups) yearGroups = this.mapOpenBoxes(yearGroups);
                groups.set('yearGroup', yearGroups);

                this.setState({ edit: false, groups });
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

    handleOpen = (index, type) => {
        const { groups } = this.state;
        if(type === 'yearGroup') {
            groups[index].open = !groups[index].open;
        }
        this.setState({ groups });
    }

    render() {
        const { 
            groupName, 
            yearGroupsAmmount, 
            show, 
            classNames,
            edit,
            groups,
        } = this.state;

        const isInvalid = groupName === "";

        console.log(groups);

        return(
            <>
                <Container>
                    <Jumbotron>
                        {edit &&
                        <>
                            <h1 className="myTextAlignCenter myFontFamily">
                                Въведете имената на випуските
                            </h1>
                            {yearGroupsAmmount && yearGroupsAmmount.map(yearClass => (
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
                                    {groups && groups.map((group, index) => (
                                        <div key={index}>
                                            <ListItem button onClick={this.handleOpen.bind(this, index, 'yearGroup')}>
                                                <ListItemIcon>
                                                    <GroupIcon />
                                                </ListItemIcon>
                                                <ListItemText primary={"Випуск: " + group.name} />
                                                {group.open ? <ExpandLess /> : <ExpandMore />}
                                            </ListItem>
                                            <Collapse in={group.open} timeout="auto" unmountOnExit>
                                                <List>
                                                    {group.children && group.children.map((classGroup, index) => (
                                                        <ListItem key={index} button onClick={this.handleOpen.bind(this, index, 'classGroup')}>
                                                            <ListItemIcon>
                                                                <GroupWorkIcon />
                                                            </ListItemIcon>
                                                            <ListItemText primary={"Клас: " + classGroup.name} />
                                                            {classGroup.open ? <ExpandLess /> : <ExpandMore />}
                                                        </ListItem>
                                                    ))}
                                                </List>
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
                                onClick={this.addGroup}
                                disabled={isInvalid}
                            >
                                {this.state.loading &&
                                    <span className="spinner-border spinner-border-sm"></span>
                                }
                                <span>Добави група</span>
                            </Button>
                        </FormGroup>
                    </Modal.Body>
                </Modal>
            </>
        );
    }
}