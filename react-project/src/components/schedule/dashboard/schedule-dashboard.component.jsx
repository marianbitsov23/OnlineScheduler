import React, { Component } from 'react';
import scheduleService from '../../../services/schedule/schedule.service';
import teachingHourService from '../../../services/schedule/teaching-hour.service';
import { AppBar, IconButton,
         Toolbar, Typography,
         Drawer, Divider, Container,
         Grid, List} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import MenuIcon from '@material-ui/icons/Menu';
import { MainListItems, SecondaryListItems } from './listItems';
import DeleteIcon from '@material-ui/icons/Delete';
import { v4 as uuidv4 } from 'uuid';
import lessonService from '../../../services/schedule/lesson.service';
import SchedulePrint from './schedule-document.component';
import WeekDays from './week-days.component';
import { CustomDialog } from '../../shared/custom-dialog.component';
import { TextInput } from '../../shared/text-input.component';
import { CustomSelect } from '../../shared/custom-select.component';
import groupService from '../../../services/schedule/group.service';
import timeTableService from '../../../services/schedule/time-management/time-table.service';
import timeSlotService from '../../../services/schedule/time-management/time-slot.service';

const useStyles = theme => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: '100%',
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaper: {
        height: '100%',
        position: 'relative',
        whiteSpace: 'nowrap',
        width: 220,
        transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
            [theme.breakpoints.up('sm')]: {
                width: theme.spacing(9),
        },
    },
});

class ScheduleDashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            schedule: scheduleService.getCurrentSchedule(),
            open: true,
            lessons: [],
            timeTables: [],
            groups: [],
            show: false,
            selectedGroup: 0,
            selectedTimeTable: 0,
            teachingHours: undefined,
            scheduleName: "",
            previousSchedules: [],
            hoursTemplate: [0, 1, 2, 3, 4, 5, 6],
            weekDaysTemplate: ['Хорариуми', 'Понеделник', 'Вторник', 'Сряда', 'Четвъртък', 'Петък']
        };

        this.handleDrawer = this.handleDrawer.bind(this);
        this.deleteSchedule = this.deleteSchedule.bind(this);
    }

    componentDidMount() {
        const weekDaysTemplate = ['Хорариуми', 'Понеделник', 'Вторник', 'Сряда', 'Четвъртък', 'Петък'];
        const timeSlotDayTemplates = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];

        const scheduleId = this.state.schedule.id;

        this.loadPreviousSchedules();

        this.fetchGroups(scheduleId)
        .then(() => {
            this.fetchTimeTables()
            .then(() => {
                const selectedTimeTable = this.state.timeTables[this.state.selectedTimeTable]
    
                lessonService.checkIfLessonsExist(scheduleId)
                .then(result => {
                    if(result.data) {
                        lessonService.getAllByScheduleId(scheduleId)
                        .then(lessons => {
                            const filteredLessons = lessons.data.filter(
                                lesson => lesson.teachingHour.timeSlots[0].timeTable.id === selectedTimeTable.id
                            );

                            console.log(filteredLessons);
                        })
                    } else {
                        teachingHourService.getAllByScheduleId(scheduleId)
                        .then(teachingHours => this.setState({ teachingHours: teachingHours.data }))
                        .then(() => this.mapLessonsBySelectedGroup());
                    }
    
                })             
            })
        })
    }

    mapLessonsBySelectedGroup = () => {
        const { teachingHours, lessons } = this.state;
        

        if(teachingHours) {
            this.mapLessonsBySelectedTimeTable();

        } else {

        }
    }

    mapLessonsBySelectedTimeTable = () => {
        const { lessons, weekDaysTemplate, teachingHours } = this.state;
        const selectedTimeTable = this.state.timeTables[this.state.selectedTimeTable];
        const timeSlotDayTemplates = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
        const selectedGroup = this.state.groups[this.state.selectedGroup];
        const filteredTeachingHours = teachingHours.filter(
            teachingHour => teachingHour.group.id === selectedGroup.id
            && teachingHour.timeSlots[0].timeTable.id === selectedTimeTable.id
        );

        lessons[0] = {
            name: weekDaysTemplate[0],
            items: this.initTeachingHours(filteredTeachingHours),
            weekDay: 0
        }

        for(let i = 1; i < 6; i++) {
            lessons[i] = {
                name: weekDaysTemplate[i],
                items: this.initializeItems(selectedTimeTable.timeSlots.filter(
                    timeSlot => timeSlot.weekDay === timeSlotDayTemplates[i - 1]
                )),
                weekDay: i
            }
        }

        this.setState({ lessons });
    }

        /*
        groupService.getAllTeachingGroups(this.state.schedule.id)
        .then(result => {
            this.setState({ groups: result.data });
        }).then(() => {
            lessonService.getAllByScheduleId(this.state.schedule.id)
            .then(result => {
                if(result.data.length !== 0) {
                    const lessons = [];
                    
                    for(let i = 0; i < 6; i++) {
                        const items = this.initializeItems();
                        result.data.forEach(lesson => {
                            for(let j = 0; j < 7; j++) {
                                if(lesson.weekDay === i && lesson.slotIndex === j) {
                                    items[j] = lesson;
                                    items[j].subItems = lesson.teachingHour.overAWeek 
                                        ? [{
                                            id: uuidv4(),
                                            teachingHour: lesson.teachingHour
                                        }, {id: uuidv4(),
                                            teachingHour: undefined}]
                                        : new Array(2);
                                }
                            }
                        });
                        lessons.push({
                            name: weekDaysTemplate[i],
                            items: i !== 0 ? items : [],
                            weekDay: i
                        });
                    }
                    this.setState({ lessons });
                }
            })
            .catch(error => {
                console.error(error);
                teachingHourService.getAllByScheduleId(this.state.schedule.id)
                .then(result => {
                    this.setState({ teachingHours: result.data });
                })
                .then(() => {
                    const lessons = [];
                    const { teachingHours } = this.state;

                    lessons.push({
                        name: weekDaysTemplate[0],
                        items: this.initializeAllLessons(teachingHours),
                        weekDay: 0
                    });

                    for(let i = 1; i < 6; i++) {
                        lessons.push({
                            name: weekDaysTemplate[i],
                            items: this.initializeItems(),
                            weekDay: i
                        });
                    }

                    this.setState({ lessons });
                })
                .catch(error => console.error(error));
            });
        })
        */
    fetchTimeTables = () => {
        return timeTableService.getAllByScheduleId(this.state.schedule.id)
        .then(async timeTables => {
            for( let i = 0; i < timeTables.data.length; i++) {
                await this.fetchTimeSlotsForTimeTable(timeTables.data[i]);
            }
            this.setState({ timeTables: timeTables.data })
        })
        .catch(error => console.error(error));
    }

    fetchTimeSlotsForTimeTable = (timeTable) => {
        return timeSlotService.getTimeSlotsByTimeTableId(timeTable.id)
        .then(timeSlots => timeTable.timeSlots = timeSlots.data)
        .catch(error => console.error(error));
    }

    fetchGroups = (scheduleId) => {
        return groupService.getAllTeachingGroups(scheduleId)
        .then(result => this.setState({ groups: result.data }))
        .catch(error => console.error(error));
    }

    setLessons = lessons => this.setState({ lessons });

    initializeItems = (timeSlots) => {
        let items = [];
        for(let i = 0; i < timeSlots.length; i++) {
            items.push({
                id: uuidv4(),
                teachingHour: undefined,
                subItems: new Array(2)
            });
        }
        return items;
    }

    loadPreviousSchedules() {
        let { previousSchedules, schedule } = this.state;

        previousSchedules = scheduleService.getPreviousSchedules();

        scheduleService.getScheduleById(schedule.id)
        .then(result => {
            let index;
            previousSchedules.forEach((prev, i) => {
                if(prev.id === schedule.id) index = i;
            });
    
            if(previousSchedules) {
                if(index !== undefined && previousSchedules[index].id === schedule.id) {
                    previousSchedules.splice(index, 1);
                }
                previousSchedules.unshift(result.data);
            } else {
                previousSchedules = [];
                previousSchedules.push(result.data);
            }
    
            scheduleService.setPreviousSchedules(previousSchedules);
    
            this.setState({ previousSchedules });
        })
        .catch(error => console.error(error));
    }

    initTeachingHours = (teachingHours) => {
        let lessons = [];
        teachingHours.forEach(teachingHour => {
            for(let i = 0; i < teachingHour.hoursPerWeek; i++) {
                lessons.push({
                    id: uuidv4(),
                    teachingHour: teachingHour,
                    subItems: teachingHour.overAWeek ? [{
                        id: uuidv4(),
                        teachingHour: teachingHour
                    }, {id: uuidv4(),
                        teachingHour: undefined}] : new Array(2)
                });
            }
        });
        return lessons;
    }

    handleDrawer = () => this.setState({ open: !this.state.open });

    onChange = event => {
        this.setState({ [event.target.name] : event.target.value });
        if([event.target.name][0] === "selectedGroup") this.fetchLessonsByGroup();
    }

    deleteSchedule = event => {
        event.preventDefault();
        const { schedule } = this.state;
        if(this.state.scheduleName === schedule.name) {
            scheduleService.deleteSchedule(schedule.id)
            .then(() => {
                this.state.previousSchedules.shift();
                scheduleService.setPreviousSchedules(this.state.previousSchedules);
                this.props.history.push('/schedules');
            })
            .catch(error => console.error(error));
        }
    }

    saveLessonsInDb = lessons => {
        lessons.forEach(lesson => {
            lesson.items.forEach(item => {
                if(typeof item.id === 'string') {
                    lessonService.create({
                        schedule: this.state.schedule,
                        weekDay: lesson.weekDay,
                        slotIndex: item.slotIndex,
                        teachingHour: item.teachingHour
                    })
                    .catch(error => console.error(error));
                } else {
                    lessonService.update({
                        id: item.id,
                        schedule: this.state.schedule,
                        weekDay: lesson.weekDay,
                        slotIndex: item.slotIndex,
                        teachingHour: item.teachingHour
                    })
                    .catch(error => console.error(error));
                }
            })
        });
    }

    fetchLessonsByGroup = () => {
        const { selectedGroup } = this.state;
        const group = this.state.groups[selectedGroup];
        const weekDaysTemplate = ['Хорариуми', 'Понеделник', 'Вторник', 'Сряда', 'Четвъртък', 'Петък'];

        teachingHourService.getAllByGroupId(group.id)
        .then(result => this.setState({ teachingHours: result.data }))
        .then(() => {
            const lessons = [];
            const { teachingHours } = this.state;

            lessons.push({
                name: weekDaysTemplate[0],
                items: this.initializeAllLessons(teachingHours),
                weekDay: 0
            });

            for(let i = 1; i < 6; i++) {
                lessons.push({
                    name: weekDaysTemplate[i],
                    items: this.initializeItems(),
                    weekDay: i
                });
            }

            this.setState({ lessons });
        })
        .catch(error => {
            this.setState({ lessons: [] });
            console.error(error);
        });
    }

    componentWillUnmount() {
        //this.saveLessonsInDb(this.state.lessons);
    }

    onClose = () => this.setState({ show: !this.state.show });

    render() {
        const { 
            open, 
            lessons, 
            show, 
            previousSchedules, 
            hoursTemplate, 
            groups,
            timeTables
        } = this.state;
        const { classes } = this.props;

        console.log(lessons);
        
        return(
            <div className="myDisplayFlexColumn">
                <AppBar position="static" className={clsx(classes.appBar, open && classes.appBarShift)}>
                    <Toolbar className="baseColor blackColor">
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={this.handleDrawer}
                            className="menuButton"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography component="h1" varinat="h6" color="inherit"
                        noWrap className="title">
                            {this.state.schedule.name}
                        </Typography>
                        <CustomSelect
                            name="selectedTimeTable"
                            value={this.state.selectedTimeTable}
                            onChange={this.onChange}
                            elements={timeTables}
                        />
                        <CustomSelect
                            name="selectedGroup"
                            value={this.state.selectedGroup}
                            onChange={this.onChange}
                            elements={groups}
                        />
                        <SchedulePrint lessons={lessons} />
                        <IconButton onClick={() => this.setState({ show: true })} color="inherit">
                            <DeleteIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <main className="myDisplayFlex ">
                    <Drawer
                    variant="permanent"
                    classes={{
                        paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
                    }}
                    open={open}>
                        <Divider />
                        <List>{MainListItems}</List>
                        <Divider />
                        <List>
                            <SecondaryListItems 
                                open={open} 
                                schedules={previousSchedules}
                            />
                        </List>
                    </Drawer>
                    <div className="content">
                        <Container maxWidth="xl" className="myDefaultPadding">
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={12} lg={12}>
                                    <div className="myDisplayFlexColumn">
                                        <WeekDays 
                                            lessons={lessons} 
                                            setLessons={this.setLessons} 
                                            hoursTemplate={hoursTemplate}
                                        />
                                    </div>
                                </Grid>
                            </Grid>
                        </Container>
                    </div>
                </main>
                <CustomDialog 
                    show={show}
                    onClose={this.onClose}
                    title="Are you sure you want to delete this schedule?"
                    confirmFunction={this.deleteSchedule}
                    confirmButtonText="Изтриване"
                    text=
                    {<>
                        Напълно сигурни ли сте че искате да изтриете този график?
                        Изтриването е перманентно и графикът не може да бъде възстановен!
                        Въведете името на графика <div className="scheduleName">{this.state.schedule.name}</div> 
                        и натиснете <span className="deleteButtonText">Изтриване</span> бутона, за да потвърдите.
                    </>}
                    content=
                    {<>
                        <TextInput 
                            name="scheduleName"
                            value={this.state.scheduleName}
                            label="Въведете името на графика"
                            type="scheduleName"
                            onChange={this.onChange}
                        />
                    </>}
                />
            </div>
        )
    }
}

export default withStyles(useStyles)(ScheduleDashboard)