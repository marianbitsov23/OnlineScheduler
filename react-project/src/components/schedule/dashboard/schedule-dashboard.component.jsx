import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import scheduleService from '../../../services/schedule/schedule.service';
import teachingHourService from '../../../services/schedule/teaching-hour.service';
import { Card } from 'semantic-ui-react'
import { AppBar, CssBaseline, IconButton,
         Toolbar, Typography,
         Drawer, Divider, Container,
         Grid, Paper, List, ListItem} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import clsx from 'clsx';
import MenuIcon from '@material-ui/icons/Menu';
import { mainListItems, secondaryListItems } from './listItems';
import DeleteIcon from '@material-ui/icons/Delete';
import { v4 as uuidv4 } from 'uuid';

const drawerWidth = 220;

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
        width: drawerWidth,
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
            lessons: []
        };

        this.handleDrawer = this.handleDrawer.bind(this);
        this.deleteSchedule = this.deleteSchedule.bind(this);
    }

    componentDidMount() {
        teachingHourService.getAllTeachingHoursByScheduleId(this.state.schedule.id)
        .then(response => {
            this.setState({ teachingHours: response.data });
        })
        .then(() => {
            const lessons = [];
            const { teachingHours } = this.state;
            const weekDaysTemplate = ['Teaching-Hours', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

            lessons.push({
                name: weekDaysTemplate[0],
                items: this.initializeAllLessons(teachingHours)
            });

            console.log(lessons);

            for(let i = 1; i < 6; i++) {
                lessons.push({
                    name: weekDaysTemplate[i],
                    items: []
                });
            }

            console.log(lessons)

            this.setState({ lessons });
        })
        .catch(error => {
            console.error(error);
        });
    }

    initializeAllLessons = teachingHours => {
        let lessons = [];
        teachingHours.forEach(teachingHour => {
            for(let i = 0; i < teachingHour.hoursPerWeek; i++) {
                lessons.push({
                    id: uuidv4(),
                    timeTable: teachingHour.timeTable,
                    schedule: teachingHour.schedule,
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

            
            lessons.map(lesson => {
                if(lesson.name === destColumn.name) {
                    lesson.items = destItems;
                } else if(lesson.name === sourceColumn.name) {
                    lesson.items = sourceItems;
                }
            });

            this.setState({ lessons });
        } else {
            const column = lessons[source.droppableId];
            const items = [...column.items];
            const [reorderedItem] = items.splice(source.index, 1);
            items.splice(destination.index, 0, reorderedItem);

            lessons.map(lesson => {
                if(lesson.name === column.name) {
                    lesson.items = items;
                }
            });

            this.setState({ lessons });
        }
    }

    handleDrawer() {
        this.setState({ open: !this.state.open})
    }

    deleteSchedule = event => {
        event.preventDefault();
        const scheduleId = this.state.schedule.id;

        scheduleService.deleteSchedule(scheduleId)
        .then(() => {
            this.props.history.push('/schedule-management');
        })
        .catch(error => {
            console.error(error);
        });
    }

    componentWillUnmount() {
        
    }

    saveLessonsInDb = lessons => {
        
    }

    render() {
        const { open, lessons } = this.state;
        const { classes } = this.props;

        return(
            <div className="myDisplayFlexColumn">
                <CssBaseline />
                <AppBar position="static" className={clsx(classes.appBar, open && classes.appBarShift)}>
                    <Toolbar className="baseColor">
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
                        <IconButton color="inherit">
                            <EditIcon />
                        </IconButton>
                        <IconButton onClick={this.deleteSchedule} color="inherit">
                            <DeleteIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <main className="myDisplayFlex secondaryBackground">
                    <Drawer
                        variant="permanent"
                        classes={{
                            paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
                        }}
                        className="tertiaryBackground"
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
                                <Grid item xs={12} md={12} lg={12}>
                                    <div className="myDisplayFlexColumn">
                                    <DragDropContext onDragEnd={this.handleOnDragEnd.bind(this)}>
                                        <Droppable droppableId="0" key="0">
                                        {(provided, snapshot) => (
                                            <Paper 
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className="paperRow">
                                                {lessons[0] && lessons[0].items.length === 0 && <h3>Nothing left here</h3>}
                                                {lessons[0] && <CardSlot column={lessons[0]}/>}
                                                {provided.placeholder}
                                            </Paper>
                                        )}
                                        </Droppable>
                                        <div className="myDefaultMarginTopBottom">
                                            <Paper className="paperRow justifyContentCenter">
                                            {Object.entries(lessons).slice(1).map(([columnId, column], index) => (
                                                <div key={columnId}>
                                                    <div className="myTextAlignCenter">
                                                        <h2>{column.name}</h2>
                                                    </div>
                                                    <div className="myDefaultMargin">
                                                        <Droppable droppableId={columnId} key={columnId}>
                                                            {(provided, snapshot) => (
                                                                <List
                                                                {...provided.droppableProps}
                                                                ref={provided.innerRef}
                                                                style={{
                                                                    background: snapshot.isDraggingOver
                                                                        ? 'lightblue'
                                                                        : 'lightgrey'
                                                                }}
                                                                className="
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
            </div>
        )
    }
}

const CardSlot = ({column}) => (
        <>
        {column.items.map((lesson, index) => (
            <Draggable key={lesson.id} draggableId={lesson.id} index={index}>
            {provided => (
                <ListItem
                className="myDefaultMarginTopAndBottom"
                key={index} 
                ref={provided.innerRef} 
                {...provided.draggableProps} 
                {...provided.dragHandleProps}>      
                    <Card className="cardMaxWidth">
                        <Card.Content>
                            <Card.Header>
                                {lesson.teachingHour.subject.name}
                            </Card.Header>
                            <Card.Meta>
                                Кабинет: {lesson.teachingHour.cabinet.name}
                            </Card.Meta>
                            <Card.Description>
                                През седмица: {lesson.teachingHour.overAWeek && <> Да</>}
                                {!lesson.teachingHour.overAWeek && <> Не</>}
                            </Card.Description>
                        </Card.Content>
                    </Card>
                </ListItem>
            )}
            </Draggable>
        ))}
        </>
);

export default withStyles(useStyles)(ScheduleDashboard)