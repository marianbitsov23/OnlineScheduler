import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import scheduleService from '../../../services/schedule/schedule.service';
import teachingHourService from '../../../services/schedule/teaching-hour.service';
import { Card } from 'semantic-ui-react'
import { AppBar, CssBaseline, IconButton,
         Toolbar, Typography,
         Drawer, Divider, Container,
         Grid, Paper, List} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import clsx from 'clsx';
import MenuIcon from '@material-ui/icons/Menu';
import { mainListItems, secondaryListItems } from './listItems';
import DeleteIcon from '@material-ui/icons/Delete';

const drawerWidth = 220;

const useStyles = theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column'
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
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
    menuButton: {
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
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
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'row',
    },
    fixedHeight: {
        height: 500,
    },
    fixedWidth: {
        width: 900,
    },
    flexRow: {
        display: 'flex',
    },
});

class ScheduleDashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            schedule: scheduleService.getCurrentSchedule(),
            open: true,
            slots: []
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
            const slots = [];
            const weekDaysTemplate = ['Teaching-Hours', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

            slots.push({
                name: weekDaysTemplate[0],
                items: this.state.teachingHours
            });

            for(let i = 1; i < 6; i++) {
                slots.push({ 
                    name: weekDaysTemplate[i],
                    items: []
                });
            }

            this.setState({ slots });
        })
        .catch(error => {
            console.error(error);
        });
    }

    handleOnDragEnd(result) {
        const { slots } = this.state;
        const { source, destination } = result;

        console.log(destination);

        if(!destination) return;
        if (source.droppableId !== destination.droppableId) {
            const sourceColumn = slots[source.droppableId];
            const destColumn = slots[destination.droppableId];
            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];
            if(destItems.length === 8 && destination.droppableId !== "0") return;
            const [recordedItem] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, recordedItem);

            this.setState({ slots: {
                ...slots,
                [source.droppableId]: {
                    ...sourceColumn,
                    items: sourceItems
                },
                [destination.droppableId]: {
                    ...destColumn,
                    items: destItems
                }
            }});
        } else {
            const column = slots[source.droppableId];
            const items = [...column.items];
            const [reorderedItem] = items.splice(source.index, 1);
            items.splice(destination.index, 0, reorderedItem);

            this.setState({ slots: {
                ...slots,
                [source.droppableId]: {
                    ...column,
                    items: items
                }
            } });
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

    saveSlotsInDb = slots => {
        
    }

    render() {
        const { open, slots } = this.state;
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
                            className={clsx(classes.menuButton)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography component="h1" varinat="h6" color="inherit" noWrap className={classes.title}>
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
                <main className={classes.flexRow}>
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
                    <div className={classes.content}>
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
                                            className={classes.paper}>
                                                {slots[0] && slots[0].items.length === 0 && <h3>Nothing left here</h3>}
                                                {slots[0] && <CardSlot column={slots[0]}/>}
                                                {provided.placeholder}
                                            </Paper>
                                        )}
                                        </Droppable>
                                        <div className="myDefaultMarginTopBottom">
                                            <Paper className={clsx(classes.paper)}>
                                            {Object.entries(slots).slice(1).map(([columnId, column], index) => (
                                                    <div key={columnId}>
                                                        <h2>{column.name}</h2>
                                                        <div className="myDefaultMargin">
                                                            <Droppable droppableId={columnId} key={columnId}>
                                                                {(provided, snapshot) => (
                                                                    <Paper
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
                                                                    </Paper>
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
        {column.items.map((teachingHour, index) => (
            <Draggable key={teachingHour.id} draggableId={teachingHour.id.toString()} index={index}>
            {provided => (
                <div 
                className="myDefaultMargin"
                ket={index} 
                ref={provided.innerRef} 
                {...provided.draggableProps} 
                {...provided.dragHandleProps}>
                    <Card>
                        <Card.Content>
                            <Card.Header>
                                Предмет: {teachingHour.subject.name}
                            </Card.Header>
                            <Card.Meta>
                                Кабинет: {teachingHour.cabinet.name}
                            </Card.Meta>
                            <Card.Description>
                                През седмица: {teachingHour.overAWeek && <> Да</>}
                                {!teachingHour.overAWeek && <> Не</>}
                            </Card.Description>
                        </Card.Content>
                    </Card>
                </div>
            )}
            </Draggable>
        ))}
        </>
);

export default withStyles(useStyles)(ScheduleDashboard)