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
import { Card } from 'semantic-ui-react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import scheduleService from '../../../services/schedule/schedule.service';

export const MainListItems = (
    <div>
        <ListItem button component={Link} to="/subject-management">
            <ListItemIcon>
                <LibraryBooksIcon className="primaryColor" />
            </ListItemIcon>
            <ListItemText primary="Предмети" />
        </ListItem>
        <ListItem button component={Link} to="/teacher-management">
            <ListItemIcon>
                <PeopleIcon className="primaryColor"/>
            </ListItemIcon>
            <ListItemText primary="Учители" />
        </ListItem>
        <ListItem button component={Link} to="/cabinet-management">
            <ListItemIcon>
                <MeetingRoomIcon className="primaryColor"/>
            </ListItemIcon>
            <ListItemText primary="Кабинети" />
        </ListItem>
        <ListItem button component={Link} to="/time-table-management">
            <ListItemIcon>
                <TableChartIcon className="primaryColor"/>
            </ListItemIcon>
            <ListItemText primary="Времеви Таблици" />
        </ListItem>
        <ListItem button component={Link} to="/group-management">
            <ListItemIcon>
                <GroupWorkIcon className="primaryColor"/>
            </ListItemIcon>
            <ListItemText primary="Групи" />
        </ListItem>
        <ListItem button component={Link} to="/teaching-hour-management">
            <ListItemIcon>
                <ChromeReaderModeIcon className="primaryColor"/>
            </ListItemIcon>
            <ListItemText primary="Хорариуми" />
        </ListItem>
    </div>
);

export const SecondaryListItems = ({open, schedules}) => (
    <>
        {open &&<ListSubheader className="myTextAlignCenter">
            Предишни графици
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
            <ListItemText primary="Няма нищо тук" secondary="Не сте редактирали нищо напоследък"/>
        </ListItem>}
    </>
  );

export const LessonSlot = ({day, slots, weekDay}) => {
    if(weekDay === 0) {
        return (
            <>
                {day.items.map((item, index) => (
                    <>
                    {item &&
                    <LessonItem
                        type={item.id.toString()}
                        subItems={item.subItems}
                        lesson={item}
                        weekDay={weekDay}
                        index={index}
                    />}
                    </>
                ))}
            </>
        )
    } else {
        return(
            <>
                {slots.map((slot, index) => (
                    <div key={slot}>
                        {day && day.items[index] &&
                            <div>
                                <LessonItem
                                    type={day.items[index].id.toString()}
                                    subItems={day.items[index].subItems}
                                    lesson={day.items[index]}
                                    weekDay={weekDay}
                                    index={index}
                                />
                            </div>
                        }
                    </div>
                ))}
            </>
        )
    }
};

export const SubItem = ({item, helperText, subIndex, index, droppableId}) => (
    <>
        <Droppable
            droppableId={droppableId + " " + index}
            type="droppableSubItem"
        >
            {(provided, snapshot) => (
                <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                >
                    {item &&
                        <Draggable
                            key={item.id}
                            draggableId={index + " " + item.id}
                            index={subIndex}
                        >
                            {(provided, snapshot) => (
                            <>
                                <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                >
                                    {item.teachingHour &&
                                        <LessonSubCard lesson={item} helperText={helperText} />
                                    }
                                    {!item.teachingHour &&
                                        <div className="emptySubCard myDisplayFlex justifyContentCenter alignItemsCenter">
                                            <p>Empty</p>
                                        </div>
                                    }
                                </div>
                                {provided.placeholder}
                            </>
                            )}
                        </Draggable>
                    }
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    </>
);

export const LessonItem = ({type, subItems, lesson, weekDay, index}) => {
    if(lesson.teachingHour && lesson.teachingHour.overAWeek) {
    return(
        <Draggable
            key={lesson.id}
            draggableId={lesson.id.toString()}
            index={index}
        >
            {(provided, snapshot) => (
                <>
                    <div 
                        className="lessonItem myDisplayFlexColumn secondaryBackground"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                    >
                        <SubItem 
                            item={subItems[0]} 
                            type={type} 
                            heplerText={0} 
                            subIndex={0}
                            index={index.toString()}
                            droppableId={(weekDay).toString()}
                        />
                        <SubItem 
                            item={subItems[1]} 
                            type={type} 
                            helperText={1} 
                            subIndex={1} 
                            index={index.toString()}
                            droppableId={(weekDay).toString()}
                        />
                    </div>
                    {provided.placeholder}
                </>
        )}
        </Draggable>
    )} else {
        return (
            <>
                {lesson && lesson.teachingHour &&
                    <Draggable key={lesson.id} draggableId={lesson.id.toString()} index={index}>
                        {provided => (
                            <div
                                className="myDefaultMarginTopAndBottom myDisplayFlex"
                                ref={provided.innerRef} 
                                {...provided.draggableProps} 
                                {...provided.dragHandleProps}
                            >
                                <LessonCard lesson={lesson} />
                            </div>
                        )}
                    </Draggable>
                }
                {lesson.teachingHour === undefined && weekDay !== 0 &&
                    <Draggable 
                        key={lesson.id} 
                        draggableId={lesson.id.toString()}
                        isDragDisabled={true}
                        index={index}
                    >
                    {provided => (
                        <div
                            ref={provided.innerRef} 
                            {...provided.draggableProps} 
                            {...provided.dragHandleProps}
                            
                        >
                            <div className="emptyCard myDisplayFlex justifyContentCenter alignItemsCenter">
                                <p className="myTextAlignCenter">Empty</p>
                            </div>
                        </div>
                    )}
                    </Draggable>
                }
            </>
        )

    }
};

const LessonCard = ({lesson}) => (
    <Card className="lessonCard myDefaultMarginTopAndBottom">
        <Card.Content>
            <Card.Header className="myWhiteColor">
                {lesson.teachingHour.subject.name}
            </Card.Header>
            <Card.Meta className="myWhiteColor">
                Преподавател: {lesson.teachingHour.teacher.name}
            </Card.Meta>
        </Card.Content>
    </Card>
);

const LessonSubCard = ({lesson, helperText}) => (
    <Card className="lessonSubCard">
        <Card.Content>
            <Card.Header className="myWhiteColor">
                {lesson.teachingHour.subject.name}
            </Card.Header>
            <Card.Meta className="myWhiteColor">
                {!helperText && <> четна седмица </>}
                {helperText && <> нечетна седмица </>}
            </Card.Meta>
        </Card.Content>
    </Card>
);