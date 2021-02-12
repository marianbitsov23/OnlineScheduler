import React, { Component } from 'react';
import scheduleService from '../../../services/schedule/schedule.service';
import teachingHourService from '../../../services/schedule/teaching-hour.service';
import { AppBar, CssBaseline, IconButton,
         Toolbar, Typography,
         Drawer, Divider, Container,
         Grid, List} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import MenuIcon from '@material-ui/icons/Menu';
import { MainListItems, SecondaryListItems, CardSlot } from './listItems';
import DeleteIcon from '@material-ui/icons/Delete';
import { v4 as uuidv4 } from 'uuid';
import lessonService from '../../../services/schedule/lesson.service';
import SchedulePrint from './schedule-document.component';
import { Modal, Form, FormControl } from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import WeekDays from './week-days.component';

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
            show: false,
            scheduleName: "",
            previousSchedules: [],
            hoursTemplate: [0, 1, 2, 3, 4, 5, 6]
        };

        this.handleDrawer = this.handleDrawer.bind(this);
        this.deleteSchedule = this.deleteSchedule.bind(this);
    }

    componentDidMount() {
        const weekDaysTemplate = ['Lessons', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

        this.loadPreviousSchedules();

        lessonService.getAllLessonsByScheduleId(this.state.schedule.id)
        .then(result => {
            if(result.data.length !== 0) {
                const lessons = [];
                
                for(let i = 0; i < 6; i++) {
                    const items = this.initalizeEmptyLessons();
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
            teachingHourService.getAllTeachingHoursByScheduleId(this.state.schedule.id)
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
                            items: [],
                            weekDay: i
                        });
                    }

                    this.setState({ lessons });
                })
                .catch(error => console.error(error));
        });
    }

    setLessons = lessons => this.setState({ lessons });

    initalizeEmptyLessons() {
        let items = [];
        for(let i = 0; i < 7; i++) {
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
                if(prev.id === schedule.id) {
                    index = i;
                }
            })
    
            if(previousSchedules) {
                if(index !== undefined && previousSchedules[index].id === schedule.id) {
                    previousSchedules.splice(index, 1);
                }
                previousSchedules.unshift(result.data);
            } else {
                previousSchedules = [];
                previousSchedules.push(result.data);
            }
    
            scheduleService.addPreviousSchedules(previousSchedules);
    
            this.setState({ previousSchedules });
        })
        .catch(error => console.error(error));
    }

    initializeAllLessons = teachingHours => {
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

    handleDrawer() {
        this.setState({ open: !this.state.open})
    }

    onChange = event => {
        this.setState({ [event.target.name] : event.target.value });
    }

    deleteSchedule = event => {
        event.preventDefault();
        const schedule = this.state.schedule;
        if(this.state.scheduleName === schedule.name) {
            scheduleService.deleteSchedule(schedule.id)
            .then(() => {
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

    componentWillUnmount() {
        //this.saveLessonsInDb(this.state.lessons);
    }


    render() {
        const { open, lessons, show, previousSchedules, hoursTemplate } = this.state;
        const { classes } = this.props;

        return(
            <div className="myDisplayFlexColumn">
                <CssBaseline />
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
                            Dashboard
                        </Typography>
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
                        <List><SecondaryListItems open={open} schedules={previousSchedules} /></List>
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
                <Modal 
                size="lg"
                show={show}
                onHide={() => this.setState({ show: !show })}
                centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Are you sure you want to delete this schedule?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h4>Enter the schedule's name</h4>
                        <h5>{this.state.schedule.name}</h5>
                        <Form.Group controlId="formBasicCurrentPassword">
                            <FormControl
                                aria-describedby="basic-addon2"
                                placeholder="Enter the schedule name"
                                name="scheduleName"
                                type="scheduleName"
                                onChange={this.onChange}
                            />
                        </Form.Group>
                        <p>
                            Are you absolutely sure that you want to delete this schedule?
                            This change is permanent and cannot be reverted. Press the Delete button to proceed.
                        </p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                        onClick={this.deleteSchedule}
                        variant="contained"
                        color="secondary">
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export default withStyles(useStyles)(ScheduleDashboard)