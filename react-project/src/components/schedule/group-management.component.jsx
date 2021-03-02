import React, { Component } from 'react';
import { Jumbotron, FormGroup } from 'react-bootstrap';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import SchoolIcon from '@material-ui/icons/School';
import groupService from '../../services/schedule/group.service';
import scheduleService from '../../services/schedule/schedule.service';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import GroupIcon from '@material-ui/icons/Group';
import { TextField, Button, List, Collapse,
    ListItem, ListItemIcon, ListItemText, Container } from '@material-ui/core';
import { CustomDialog } from '../shared/custom-dialog.component';
import { TextInput } from '../shared/text-input.component';
import CloseIcon from '@material-ui/icons/Close';
import { NextButton } from '../shared/next-button.component';

export default class ManageGroups extends Component {
    constructor(props) {
        super(props);

        this.state = {
            groupName: "",
            parent: {},
            groups: [],
            selectedClass: 0,
            selectedSubClass: undefined,
            schedule: scheduleService.getCurrentSchedule(),
            show: false,
            edit: true
        };

        this.addGroup.bind(this);
        this.saveGroups.bind(this);
    }

    componentDidMount() {
        groupService.getAllByScheduleId(this.state.schedule.id)
        .then(result => {
            const schoolType = this.state.schedule.schoolType;

            const parent = result.data.find(group => group.parent === null);

            const yearGroupsAmmount = schoolType === "MIDDLESCHOOL" 
                    ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
                    : [0, 1, 2, 3, 4];

            if(result.data.length > 1) {
                this.fetchGroupsByType(parent)
                .then(groups => {
                    this.setState({ groups: groups });
                });

                this.setState({ edit: false, yearGroupsAmmount });
            } else { 
                const groups = this.state.groups;

                yearGroupsAmmount.forEach(() => {
                    groups.push({
                        name: "",
                        schedule: this.state.schedule,
                        parent: undefined,
                        children: []
                    });
                });
    
                this.setState({ yearGroupsAmmount, parent, groups });
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
                    group.children = this.mapOpenBoxes(children);
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
        const { groupName, schedule, groups, selectedClass, selectedSubClass } = this.state; 
        const selectedGroup = groups[selectedClass];
        let selectedSubGroup = undefined;
        
        if(selectedSubClass !== undefined) selectedSubGroup = selectedGroup.children[selectedSubClass];

        groupService.create({ 
            parent: selectedSubGroup !== undefined ? selectedSubGroup : selectedGroup, 
            groupName: groupName, 
            schedule: schedule 
        })
        .then(result => {
            if(selectedSubGroup) {
                if(!groups[selectedClass].children[selectedSubClass].children) {
                    groups[selectedClass].children[selectedSubClass].children = [];
                }
                groups[selectedClass].children[selectedSubClass].children.push(result.data);
            } else {
                groups[selectedClass].children.push(result.data);
            }

            this.setState({ groups, groupName: '', show: false, selectedSubClass: undefined });
        })
        .catch(error => console.error(error));
    }

    mapOpenBoxes = groups => {
        groups.forEach(group => group.open = false);

        return groups;
    }

    saveGroups = event => {
        event.preventDefault();
        const { parent, groups, schedule } = this.state;

        groups.forEach(group => {
            if(group.parent === undefined) {
                groupService.create({ parent: parent, groupName: group.name, schedule: schedule })
                .then(result => {
                    group.id = result.data.id;
                    group.parent = parent;
                    group.schedule = schedule;
                    group.children = [];
                })
                .then(() => {
                    this.setState({ edit: false, groups });
                }) 
                .catch(error => console.error(error));
            } else {
                groupService.update(group)
                .then(this.setState({ edit: false }))
                .catch(error => console.error(error));
            }
        }); 
    }

    groupChange = event => {
        const { groups } = this.state;
        groups[parseInt(event.target.name)].name = event.target.value;

        this.setState({ groups });
    }

    onChange = event => this.setState({ [event.target.name]: event.target.value }); 

    handleOpen = (indexes, type) => {
        const { groups } = this.state;
        if(type === "yearGroup") {
            groups[indexes].open = !groups[indexes].open;
        }
        else if(type === "classGroup") {
            const { groupIndex, classIndex } = indexes;
            groups[groupIndex].children[classIndex].open = 
            !groups[groupIndex].children[classIndex].open;
        }
        
        this.setState({ groups });
    }

    deleteGroup = (group, type, index, classGroup) => {
        let { groups } = this.state;

        const deletedGroup = classGroup === undefined 
            ? group.children[index]
            : classGroup.children[index];

        groupService.deleteGroup(deletedGroup.id)
        .then(() => {
            if(type === 'classGroup') group.children.splice(group.children.indexOf(deletedGroup), 1);
            else classGroup.children.splice(classGroup.children.indexOf(deletedGroup), 1);

            this.setState({ groups });
        })
        .catch(error => console.error(error));
    }

    render() {
        const { 
            groupName, 
            yearGroupsAmmount, 
            show, 
            edit,
            groups,
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
                            {yearGroupsAmmount && yearGroupsAmmount.map(yearClass => (
                                <FormGroup key={yearClass}>
                                    <TextField
                                        label="Име на випуска"
                                        placeholder="Въведете името на випуска"
                                        fullWidth
                                        name={yearClass.toString()}
                                        margin="normal"
                                        value={groups[yearClass].name}
                                        onChange={this.groupChange}
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
                                    {groups && groups.map((group, groupIndex) => (
                                        <div key={groupIndex}>
                                            <ListItem button onClick={this.handleOpen.bind(this, groupIndex, 'yearGroup')}>
                                                <ListItemIcon>
                                                    <SchoolIcon />
                                                </ListItemIcon>
                                                <ListItemText primary={"Випуск: " + group.name} />
                                                {group.open ? <ExpandLess /> : <ExpandMore />}
                                            </ListItem>
                                            <Collapse in={group.open} timeout="auto" unmountOnExit>
                                                <List className="myDisplayFlex">
                                                    {group.children && group.children.map((classGroup, classIndex) => (
                                                        <div key={classIndex}>
                                                        <ListItem 
                                                            button 
                                                            onClick={this.handleOpen.bind(this, 
                                                            {groupIndex, classIndex}, 'classGroup')}
                                                        >
                                                            <ListItemIcon>
                                                                <GroupWorkIcon />
                                                            </ListItemIcon>
                                                            <ListItemText primary={"Клас: " + classGroup.name} />
                                                            <CloseIcon
                                                                onClick={this.deleteGroup.bind(this, group, 'classGroup', classIndex, undefined)} 
                                                            />
                                                        </ListItem>
                                                        <Collapse in={classGroup.open} timeout="auto" unmountOnExit>
                                                            <List>
                                                                {classGroup.children && classGroup.children.map((subGroup, subIndex) => (
                                                                    <ListItem 
                                                                        button 
                                                                        key={subIndex}
                                                                        onClick={this.handleOpen.bind(
                                                                            this,
                                                                            {groupIndex, classIndex, subIndex}, 
                                                                            'subGroup')}
                                                                    >
                                                                        <ListItemIcon>
                                                                            <GroupIcon />
                                                                        </ListItemIcon>
                                                                    <ListItemText primary={"Подгрупа: " + subGroup.name} />
                                                                    <CloseIcon 
                                                                        onClick={this.deleteGroup.bind(this, group, 'subGroup', subIndex, classGroup)} 
                                                                    />
                                                                    </ListItem>
                                                                ))}
                                                            </List>
                                                            <Button
                                                                variant="contained"
                                                                color="secondary"
                                                                onClick={() => 
                                                                    this.setState({ 
                                                                        show: !show, 
                                                                        selectedClass: groupIndex,
                                                                        selectedSubClass: classIndex
                                                                    })}
                                                            >
                                                                Добави подгрупа
                                                            </Button>
                                                        </Collapse>
                                                        </div>
                                                    ))}
                                                </List>
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={() => this.setState({ 
                                                        show: !show, 
                                                        selectedClass: groupIndex 
                                                    })}
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
                    
                    <NextButton link={"/teaching-hour-management"}/>
                </Container>
                <CustomDialog
                    show={show}
                    onClose={() => this.setState({ show: false })}
                    title="Въвъедете името на класа"
                    confirmFunction={this.addGroup}
                    confirmButtonText="Добави група"
                    content={
                        <TextInput 
                            name="groupName"
                            value={groupName}
                            label="Въведете името на групата"
                            type="text"
                            onChange={this.onChange}
                        />}
                />
            </>
        );
    }
}