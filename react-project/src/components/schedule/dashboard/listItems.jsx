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

export const SecondaryListItems = ({schedules}) => (
    <>
      <ListSubheader inset>Previous schedules</ListSubheader>
      {schedules && schedules.slice(1).map((schedule, index) => 
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
    </>
  );

  export const CardSlot = ({column}) => (
    <>
    {column.items.map((lesson, index) => (
        <Draggable key={lesson.id} draggableId={lesson.id.toString()} index={index}>
        {provided => (
            <div
            className="myDefaultMarginTopAndBottom"
            key={index} 
            ref={provided.innerRef} 
            {...provided.draggableProps} 
            {...provided.dragHandleProps}>      
                <Card className="cardSlot">
                    <Card.Content>
                        <Card.Header className="myWhiteColor">
                            {lesson.teachingHour.subject.name}
                        </Card.Header>
                        <Card.Meta className="myWhiteColor">
                            Преподавател: {lesson.teachingHour.teacher.name}
                        </Card.Meta>
                        <Card.Description className="myWhiteColor">
                            През седмица: {lesson.teachingHour.overAWeek && <> Да</>}
                            {!lesson.teachingHour.overAWeek && <> Не</>}
                        </Card.Description>
                    </Card.Content>
                </Card>
            </div>
        )}
        </Draggable>
    ))}
    </>
);