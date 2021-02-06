import React, { Component } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import scheduleService from '../../../services/schedule/schedule.service';
import teachingHourService from '../../../services/schedule/teaching-hour.service';
import { AppBar, CssBaseline, IconButton,
         Toolbar, Typography,
         Drawer, Divider, Container,
         Grid, Paper, List} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import MenuIcon from '@material-ui/icons/Menu';
import { mainListItems, secondaryListItems, CardSlot } from './listItems';
import DeleteIcon from '@material-ui/icons/Delete';
import { v4 as uuidv4 } from 'uuid';
import lessonService from '../../../services/schedule/lesson.service';
import SchedulePrint from './schedule-document.component';
import { Modal, Form, FormControl } from 'react-bootstrap';
import Button from '@material-ui/core/Button';

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
            scheduleName: ""
        };

        this.handleDrawer = this.handleDrawer.bind(this);
        this.deleteSchedule = this.deleteSchedule.bind(this);
    }

    componentDidMount() {
        const weekDaysTemplate = ['Lessons', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

        lessonService.getAllLessonsByScheduleId(this.state.schedule.id)
        .then(result => {
            if(result.data) {
                const lessons = [];
                for(let i = 0; i < 6; i++) {
                    lessons.push({
                        name: weekDaysTemplate[i],
                        items: result.data.filter(lesson => lesson.weekDay === i),
                        weekDay: i
                    });
                }
                this.setState({ lessons });
            }
        })
        .catch(error => {
            console.error(error);
            teachingHourService.getAllTeachingHoursByScheduleId(this.state.schedule.id)
                .then(response => {
                    this.setState({ teachingHours: response.data });
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
        });
    }

    initializeAllLessons = teachingHours => {
        let lessons = [];
        teachingHours.forEach(teachingHour => {
            for(let i = 0; i < teachingHour.hoursPerWeek; i++) {
                lessons.push({
                    id: uuidv4(),
                    teachingHour: teachingHour
                });
            }
        });
        return lessons;
    }

    handleOnDragEnd(result) {
        const { lessons } = this.state;
        const { source, destination } = result;


        if(!destination) return;
        if (source.droppableId !== destination.droppableId) {
            const sourceColumn = lessons[source.droppableId];
            const destColumn = lessons[destination.droppableId];
            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];
            if(destItems.length === 8 && destination.droppableId !== "0") return;
            const [recordedItem] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, recordedItem);

            
            lessons.forEach((lesson, index) => {
                if(lesson.name === destColumn.name) {
                    lesson.items = destItems;
                    this.setIndexes(lesson.items, index);
                    lesson.weekDay = index;
                } else if(lesson.name === sourceColumn.name) {
                    lesson.items = sourceItems;
                    this.setIndexes(lesson.items, index);
                    lesson.weekDay = index;
                }
            });

            this.setState({ lessons });
        } else {
            const column = lessons[source.droppableId];
            const items = [...column.items];
            const [reorderedItem] = items.splice(source.index, 1);
            items.splice(destination.index, 0, reorderedItem);

            lessons.forEach((lesson, index) => {
                if(lesson.name === column.name) {
                    lesson.items = items;
                    this.setIndexes(lesson.items, index);
                    lesson.weekDay = index;
                }
            });

            this.setState({ lessons });
        }
    }

    setIndexes = (items, weekDay) => {
        items.forEach((item, index) => {
            item.slotIndex = index;
            item.weekDay = weekDay;
        });
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
            .catch(error => {
                console.error(error);
            });
        }
    }

    componentWillUnmount() {
        //this.saveLessonsInDb(this.state.lessons);
    }

    saveLessonsInDb = lessons => {
        lessons.forEach(lesson => {
            lesson.items.forEach(item => {
                lessonService.create({
                    schedule: this.state.schedule,
                    weekDay: lesson.weekDay,
                    slotIndex: lesson.slotNumber,
                    teachingHour: item.teachingHour
                })
                .catch(error => {
                    console.error(error);
                });
            })
        });
    }

    render() {
        const { open, lessons, show } = this.state;
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
                        open={open}
                    >
                        <Divider />
                        <List>{mainListItems}</List>
                        <Divider />
                        <List>{secondaryListItems}</List>
                    </Drawer>
                    <div className="content">
                        <Container maxWidth="xl" className="myDefaultPadding">
                            <Grid container spacing={3}>
                                <Grid item xs={6} md={12} lg={12}>
                                    <div className="myDisplayFlexColumn">
                                    <DragDropContext onDragEnd={this.handleOnDragEnd.bind(this)}>
                                        <Droppable droppableId="0" key="0">
                                        {(provided, snapshot) => (
                                            <Paper 
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className="paperRow">
                                                {lessons[0] && lessons[0].items.length === 0 && 
                                                    <h3 className="myFontFamily">Nothing left here</h3>
                                                }
                                                {lessons[0] && <CardSlot column={lessons[0]}/>}
                                                {provided.placeholder}
                                            </Paper>
                                        )}
                                        </Droppable>
                                        <div className="myDefaultMarginTopBottom">
                                            <Paper className="paperRow">
                                            {Object.entries(lessons).slice(1).map(([columnId, column], index) => (
                                                <div key={columnId}>
                                                    <div className="myTextAlignCenter">
                                                        <h2 className="myFontFamily">{column.name}</h2>
                                                    </div>
                                                    <div className="myDefaultMargin">
                                                        <Droppable droppableId={columnId} key={columnId}>
                                                            {(provided, snapshot) => (
                                                                <List
                                                                {...provided.droppableProps}
                                                                ref={provided.innerRef}
                                                                className="
                                                                boxShadow
                                                                myDefaultPadding 
                                                                myDefaultMinHeight
                                                                myDefaultMinWidth"
                                                                >
                                                                    <CardSlot column={column}/>
                                                                    {provided.placeholder}
                                                                </List>
                                                            )}
                                                        </Droppable>
                                                    </div>
                                                </div>
                                            ))}
                                            </Paper>
                                        </div>
                                    </DragDropContext>
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