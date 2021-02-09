import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import PeopleIcon from '@material-ui/icons/People';
import AssignmentIcon from '@material-ui/icons/Assignment';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import TableChartIcon from '@material-ui/icons/TableChart';
import ChromeReaderModeIcon from '@material-ui/icons/ChromeReaderMode';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import { Link } from 'react-router-dom';
import { Card } from 'semantic-ui-react'
import { Draggable } from 'react-beautiful-dnd';
import scheduleService from '../../../services/schedule/schedule.service';
import HistoryIcon from '@material-ui/icons/History';

export const MainListItems = (
    <div>
        <ListItem button component={Link} to="/subject-management">
            <ListItemIcon>
                <LibraryBooksIcon className="primaryColor" />
            </ListItemIcon>
            <ListItemText primary="Subjects" />
        </ListItem>
        <ListItem button component={Link} to="/teacher-management">
            <ListItemIcon>
                <PeopleIcon className="primaryColor"/>
            </ListItemIcon>
            <ListItemText primary="Teachers" />
        </ListItem>
        <ListItem button component={Link} to="/cabinet-management">
            <ListItemIcon>
                <MeetingRoomIcon className="primaryColor"/>
            </ListItemIcon>
            <ListItemText primary="Cabinets" />
        </ListItem>
        <ListItem button component={Link} to="/time-table-management">
            <ListItemIcon>
                <TableChartIcon className="primaryColor"/>
            </ListItemIcon>
            <ListItemText primary="Time Tables" />
        </ListItem>
        <ListItem button>
            <ListItemIcon>
                <GroupWorkIcon className="primaryColor"/>
            </ListItemIcon>
            <ListItemText primary="Groups" />
        </ListItem>
        <ListItem button component={Link} to="/teaching-hour-management">
            <ListItemIcon>
                <ChromeReaderModeIcon className="primaryColor"/>
            </ListItemIcon>
            <ListItemText primary="Teaching Hours" />
        </ListItem>
    </div>
);

export const SecondaryListItems = ({open, schedules}) => (
    <>
        {open &&<ListSubheader className="myTextAlignCenter">
          Previous schedules
        </ListSubheader>}
        {schedules.slice(1).map((schedule, index) => 
        <Link to={'/schedule-dashboard'} 
        onClick={() => {
            scheduleService.saveCurrentSchedule(schedule);
            window.location.reload();
        }} 
        className="nav-link"
        key={index}>
            <ListItem>
                <ListItemIcon>
                    <AssignmentIcon className="primaryColor"/>
                </ListItemIcon>
                <ListItemText primary={schedule.name}/>
            </ListItem>
        </Link>
        )}
        {schedules.length === 1 && open &&
        <ListItem>
            <ListItemText primary="Nothing here" secondary="You havent edited recently"/>
        </ListItem>}
    </>
  );

  export const CardSlot = ({column, slots, weekDay}) => (
    <>
    {slots.map((slot, index) => (
        <div key={slot}>
        {column.items[index] && column.items[index].teachingHour &&
        <Draggable key={column.items[index].id} draggableId={column.items[index].id.toString()} index={index}>
        {provided => (
            <div
            className="myDefaultMarginTopAndBottom myDisplayFlex"
            key={index} 
            ref={provided.innerRef} 
            {...provided.draggableProps} 
            {...provided.dragHandleProps}>      
                <div className="myDisplayFlex alignItemsCenter">
                    <h4>{index + 1}.</h4>
                </div>
                <Card className="cardSlot">
                    <Card.Content>
                        <Card.Header className="myWhiteColor">
                            {column.items[index].teachingHour.subject.name}
                        </Card.Header>
                        <Card.Meta className="myWhiteColor">
                            Преподавател: {column.items[index].teachingHour.teacher.name}
                        </Card.Meta>
                        <Card.Description className="myWhiteColor">
                            През седмица: {column.items[index].teachingHour.overAWeek && <> Да</>}
                            {!column.items[index].teachingHour.overAWeek && <> Не</>}
                        </Card.Description>
                    </Card.Content>
                </Card>
            </div>
        )}
        </Draggable>}
        {!column.items[index].teachingHour && weekDay !== 0 &&
            <Draggable 
                key={column.items[index].id} 
                draggableId={column.items[index].id.toString()}
                index={index}
                isDragDisabled={true}
            >
            {provided => (
                <div
                className="myDefaultMarginTopAndBottom myDisplayFlex emptyCardSlot"
                key={index} 
                ref={provided.innerRef} 
                {...provided.draggableProps} 
                {...provided.dragHandleProps}>      
                    <div className="myDisplayFlex alignItemsCenter">
                        <h4>{index + 1}.</h4>
                    </div>
                    <div className="lightgrayBackground boxShadow emptyCard">
                    </div>
                </div>
            )}
            </Draggable>
        }
        </div>
    ))}
    </>
);