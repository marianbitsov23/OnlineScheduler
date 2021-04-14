import React, { Component } from 'react';
import { FormGroup } from 'react-bootstrap';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import SchoolIcon from '@material-ui/icons/School';
import groupService from '../../services/schedule/group.service';
import scheduleService from '../../services/schedule/schedule.service';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import GroupIcon from '@material-ui/icons/Group';
import { List, Collapse, Paper,
    ListItem, ListItemIcon, ListItemText, Container } from '@material-ui/core';
import { CustomDialog } from '../shared/custom-dialog.component';
import { TextInput } from '../shared/text-input.component';
import DeleteIcon from '@material-ui/icons/Delete';
import { ButtonPagination } from '../shared/custom-buttons/button-pagination.component';
import { SaveButton } from '../shared/custom-buttons/save-button.component';
import { EditButton } from '../shared/custom-buttons/edit-button.component';

export default class ManageGroups extends Component {
    constructor(props) {
        super(props);

        this.state = {
            groupName: "",
            parent: {},
            groups: [],
            isInvalidGroupName: false,
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

    addGroup = () => {
        const { groupName, schedule, groups, selectedClass, selectedSubClass } = this.state; 
        const selectedGroup = groups[selectedClass];
        let selectedSubGroup = undefined;
        
        if(selectedSubClass !== undefined) selectedSubGroup = selectedGroup.children[selectedSubClass];

        groupService.create({ 
            parent: selectedSubGroup !== undefined ? selectedSubGroup : selectedGroup, 
            name: groupName, 
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
                groupService.create({ parent: parent, name: group.name, schedule: schedule })
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

    onChange = event => {
        this.setState({ 
            isInvalidGroupName: 
                event.target.value.length < 0 ||
                event.target.value.length > 8
        });
        this.setState({ [event.target.name]: event.target.value }); 
    }

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
            isInvalidGroupName
        } = this.state;

        return(
            <>
                <Container>
                    <Paper className="myDefaultPadding">
                        {edit &&
                        <>
                            <h1 className="myTextAlignCenter myFontFamily">
                                Въведете имената на випуските
                            </h1>
                            {yearGroupsAmmount && yearGroupsAmmount.map(yearClass => (
                                <FormGroup key={yearClass}>
                                    <TextInput
                                        label="Име на випуска"
                                        placeholder="Въведете името на випуска"
                                        name={yearClass.toString()}
                                        value={groups[yearClass].name}
                                        onChange={this.groupChange}
                                    />
                                </FormGroup>
                            ))}
                            <SaveButton
                                fullWidth={true}
                                text="Запазване"
                                onClick={this.saveGroups}
                            />
                        </>
                        }{!edit && 
                            <>
                                <h1 className="myTextAlignCenter myFontFamily">
                                    Запазване на випуски
                                </h1>
                                <List>
                                    {groups && groups.map((group, groupIndex) => (
                                        <div key={groupIndex}>
                                            <ListItem 
                                                className="backgroundColor myDefaultMarginTopBottom" 
                                                button 
                                                onClick={this.handleOpen.bind(this, groupIndex, 'yearGroup')}
                                            >
                                                <ListItemIcon>
                                                    <SchoolIcon />
                                                </ListItemIcon>
                                                <ListItemText 
                                                    className="myDisplayFlex justifyContentSpaceBetween alignItemsCenter"
                                                    primary={"Випуск: " + group.name} 
                                                    secondary={group.open &&
                                                        <SaveButton
                                                            onClick={() => this.setState({ 
                                                                show: !show, 
                                                                selectedClass: groupIndex 
                                                            })}
                                                            text="Добави нов клас"
                                                        />}
                                                />
                                                <div className="margin-left-32px">
                                                    {group.open ? <ExpandLess /> : <ExpandMore />}
                                                </div>
                                            </ListItem>
                                            <Collapse className="margin-16px backgroundColor" in={group.open} timeout="auto" unmountOnExit>
                                                <List>
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
                                                                <ListItemText
                                                                    className="myDisplayFlex justifyContentSpaceBetween alignItemsCenter" 
                                                                    primary={"Клас: " + classGroup.name} 
                                                                    secondary={
                                                                        <EditButton
                                                                            text="Добави нова подгрупа"
                                                                            onClick={() => 
                                                                                this.setState({ 
                                                                                    show: !show, 
                                                                                    selectedClass: groupIndex,
                                                                                    selectedSubClass: classIndex
                                                                                })}
                                                                        />}
                                                                />
                                                                <div className="margin-left-32px">
                                                                    <DeleteIcon
                                                                        onClick={this.deleteGroup.bind(
                                                                            this, group, 'classGroup', classIndex, undefined
                                                                        )} 
                                                                    />
                                                                </div>
                                                            </ListItem>
                                                            <List className="margin-16px">
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
                                                                    <DeleteIcon 
                                                                        onClick={this.deleteGroup.bind(this, group, 'subGroup', subIndex, classGroup)} 
                                                                    />
                                                                    </ListItem>
                                                                ))}
                                                            </List>
                                                        </div>
                                                    ))}
                                                </List>
                                            </Collapse>
                                        </div>
                                    ))}
                                </List>
                                <EditButton
                                    fullWidth={true}
                                    text="Редактиране на имената на випуските"
                                    onClick={() => this.setState({ edit: true })}
                                />
                            </>
                        }
                    </Paper>    
                    <ButtonPagination
                        backwardLink={"/schedule-management"}
                        forwardLink={"/subject-management"}
                    />
                </Container>
                <CustomDialog
                    show={show}
                    onClose={() => this.setState({ show: false })}
                    title="Въвъедете името на класа"
                    disabled={isInvalidGroupName}
                    confirmFunction={this.addGroup}
                    confirmButtonText="Добави група"
                    content={
                        <TextInput 
                            error={isInvalidGroupName}
                            helperText="Групата трябва да е до 8 символа"
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