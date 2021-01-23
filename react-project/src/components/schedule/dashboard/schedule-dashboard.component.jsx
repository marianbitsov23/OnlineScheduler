import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import scheduleService from '../../../services/schedule/schedule.service';
import teachingHourService from '../../../services/schedule/teaching-hour.service';
import { Card } from 'semantic-ui-react'
import { AppBar, CssBaseline, IconButton,
         Toolbar, Typography, Badge,
         Drawer, Divider, Container,
         Grid, Paper, List} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
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
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 240,
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
            teachingHours: [],
            open: true
        };

        this.handleDrawer = this.handleDrawer.bind(this);
    }

    componentDidMount() {
        teachingHourService.getAllTeachingHoursByScheduleId(this.state.schedule.id)
        .then(response => {
            this.setState({ teachingHours: response.data });
        })
        .catch(error => {
            console.error(error);
        })
    }

    handleOnDragEnd(result) {
        if(!result.destination) return;

        const teachingHours = Array.from(this.state.teachingHours);
        const [reorderedItem] = teachingHours.splice(result.source.index, 1);
        teachingHours.splice(result.destination.index, 0, reorderedItem);

        this.setState({ teachingHours });
    }

    handleDrawer() {
        this.setState({ open: !this.state.open})
    }

    render() {
        const { teachingHours, open } = this.state;

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
                        <Container maxWidth="lg" className={classes.container}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={8} lg={9}>
                                    <Paper className={clsx(classes.paper, classes.fixedHeight)}>
                                        {/* 'time table here' */}
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Container>
                    </div>
                </main>
            </div>
        )
    }
}

export default withStyles(useStyles)(ScheduleDashboard)