import React, { Component } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Paper, List } from '@material-ui/core';
import { LessonSlot } from './listItems';
import { v4 as uuidv4 } from 'uuid';
import { CustomAlert } from '../../shared/custom-alert.component';

const primaryColor = "#2196F3";
const whiteColor = "#fafafa";

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? primaryColor : whiteColor,
    padding: '1rem',
    width: 200
});

export default class WeekDays extends Component {
    constructor(props) {
        super(props);

        this.state = {
            message: "",
            show: false
        };
    }

    handleOnDragEnd(result) {
        const { lessons, setLessons } = this.props;
        const { source, destination, draggableId } = result;
        
        if(!destination) return;

        const destDay = parseInt(destination.droppableId.split(" ", 2)[0]);
        const destIndex = parseInt(destination.droppableId.split(" ", 2)[1]);
        const sourceDay = parseInt(source.droppableId.split(" ", 2)[0]);
        const subIndex = parseInt(draggableId.split(" ", 1));
        
        if (destDay === sourceDay
            && destination.index === source.index) return;
      
        if (destDay === sourceDay) {
            if (result.type === "droppableSubItem") {
                if(destination.index > 1) return;
                const items = [...lessons[destDay].items];
                const subItems = [...items[subIndex].subItems];
                const removedItem = subItems[destination.index];

                subItems[destination.index] = subItems[source.index];
                subItems[source.index] = removedItem;

                items[subIndex].subItems = subItems;
                lessons[destDay].items = items;

                setLessons(lessons);
            } else if (result.type === "droppableItem") {
                const items = JSON.parse(JSON.stringify(lessons[destDay].items));
                const removedItemTeachingHour = items[destination.index].teachingHour;
                const subItemOne = items[destination.index].subItems[0];
                const subItemTwo = items[destination.index].subItems[1];

                items[destination.index].teachingHour = items[source.index].teachingHour;
                items[destination.index].subItems[0] = items[source.index].subItems[0];
                items[destination.index].subItems[1] = items[source.index].subItems[1];
                items[source.index].teachingHour = removedItemTeachingHour;
                items[source.index].subItems[0] = subItemOne;
                items[source.index].subItems[1] = subItemTwo;

                lessons[destination.droppableId].items = items;
        
                setLessons(lessons);
            }
        } else {
            const destItems = JSON.parse(JSON.stringify(lessons[destDay].items));
            const sourceItems = JSON.parse(JSON.stringify(lessons[sourceDay].items));

            if(destItems[destination.index] === undefined
                && destDay !== 0) return;
            else if (destDay === 0) {
                const newItem = {
                    id: uuidv4(),
                    teachingHour: sourceItems[source.index].teachingHour,
                    subItems: [sourceItems[source.index].subItems[0],
                    sourceItems[source.index].subItems[1]]
                }
                destItems.push(newItem);
                sourceItems[source.index].teachingHour = null;
                sourceItems[source.index].subItems[0] = null;
                sourceItems[source.index].subItems[1] = null;

                lessons[destDay].items = destItems;
                lessons[sourceDay].items = sourceItems;
    
                setLessons(lessons);
                return;
            }

            if (result.type === "droppableSubItem") {
                if (destination.index > 1) return;
                const destSubItems = [...destItems[destIndex].subItems];
                const sourceSubItems = [...sourceItems[subIndex].subItems];
                const removedItem = destSubItems[destination.index];

                destSubItems[destination.index] = sourceSubItems[source.index];
                sourceSubItems[source.index] = removedItem;

                destItems[destIndex].subItems = destSubItems;
                sourceItems[subIndex].subItems = sourceSubItems;
                
                lessons[destDay].items = destItems;
                lessons[sourceDay].items = sourceItems;

                setLessons(lessons);
            } else if (result.type === "droppableItem") {
                const removedItemTeachingHour = destItems[destination.index].teachingHour;

                if(sourceItems[source.index].subItems[0] || sourceItems[source.index].subItems[1]) {
                    //swapping the first subitems
                    destItems[destination.index].subItems[0] = 
                        [sourceItems[source.index].subItems[0], 
                        sourceItems[source.index].subItems[0] = destItems[destination.index].subItems[0]][0];
                    
                    //swapping the second subitems
                    destItems[destination.index].subItems[1] = 
                        [sourceItems[source.index].subItems[1], 
                        sourceItems[source.index].subItems[1] = destItems[destination.index].subItems[1]][0];
                    
                    //swapping the teaching hour
                    sourceItems[source.index].teachingHour = removedItemTeachingHour;
                } else {
                    //swapping theaching hours
                    destItems[destination.index].teachingHour = sourceItems[source.index].teachingHour;
                    sourceItems[source.index].teachingHour = removedItemTeachingHour;
                }

                if(this.validateLesson(
                    sourceItems[source.index], destItems[destination.index]
                )) {
                    //saving the changes
                    lessons[destination.droppableId].items = destItems;
                    lessons[source.droppableId].items = sourceItems;
        
                    setLessons(lessons);
                } else {
                    this.setState({ 
                        show: true
                    });
                }
            }
        }
    }

    validateLesson = (sourceLesson, destLesson) => {
        let teachingHour;

        if(destLesson.subItems[0]) {
            teachingHour = destLesson.subItems[0].teachingHour;
        } else if(destLesson.subItems[1]) {
            teachingHour = destLesson.subItems[1].teachingHour;
        } else if(destLesson.teachingHour) {
            teachingHour = destLesson.teachingHour;
        }

        if(this.validateTimeSpan(
            teachingHour,
            destLesson.slotIndex,
            destLesson.weekDay) &&
        this.validateTimeSpan(
            teachingHour,
            sourceLesson.slotIndex,
            sourceLesson.weekDay) && 
        this.validateEmptySpot(
            teachingHour,
            destLesson.slotIndex,
            destLesson.weekDay
        )) {
            return true;
        }
        else return false;
    }

    validateEmptySpot = (teachingHour, index, weekDay) => {
        const { fetchedLessons } = this.props;

        if(!fetchedLessons) return true;

        for(let i = 0; i < fetchedLessons.length; i++) {
            const l = fetchedLessons[i];

            if(l.teachingHour && l.slotIndex === index && l.weekDay === weekDay) {
                if(teachingHour.teacher.id === l.teachingHour.teacher.id) {
                    this.setState({ message: `Преподавател ${teachingHour.teacher.name} е зает в този времеви диапазон!`});
                    return false;
                } else if(teachingHour.cabinet.id === l.teachingHour.cabinet.id) {
                    this.setState({ message: `Кабинет ${teachingHour.cabinet.name} е зает в този времеви диапазон!`});
                    return false;
                }
            } else if(l.subLessonOneTeachingHour && 
                l.slotIndex === index && l.weekDay === weekDay) {
                if(teachingHour.subItems[0].teacher.id  === l.subLessonOneTeachingHour.teacher.id) {
                    this.setState({ message: `Преподавател ${l.subLessonOneTeachingHour.teacher.id} е зает в този времеви диапзаон!`});
                    return false;
                } else if(teachingHour.subItems[1].cabinet.id === l.subLessonOneTeachingHour.cabinet.id) {
                    this.setState({ message: `Кабинет ${l.subLessonOneTeachingHour.cabinet.id} е зает в този времеви диапазон!`});
                    return false;
                }
            } else if(l.subLessonTwoTeachingHour &&
                l.slotIndex === index && l.weekDay === weekDay) {
                if(teachingHour.subItems[0].teacher.id  === l.subLessonTwoTeachingHour.teacher.id) {
                    this.setState({ message: `Преподавател ${l.subLessonTwoTeachingHour.teacher.id} е зает в този времеви диапзаон!`});
                    return false;
                } else if(teachingHour.subItems[1].cabinet.id === l.subLessonTwoTeachingHour.cabinet.id) {
                    this.setState({ message: `Кабинет ${l.subLessonTwoTeachingHour.cabinet.id} е зает в този времеви диапазон!`});
                    return false;
                }
            }
        }

        return true;
    }

    validateTimeSpan = (teachingHour, index, weekDay) => {
        let timeSlots = teachingHour ? teachingHour.timeSlots : [];

        console.log(teachingHour);

        switch(weekDay) {
            case 0:
                return true;
            case 1:
                timeSlots = timeSlots.filter(timeSlot => timeSlot.weekDay === 'MONDAY');
                return this.validateTimeSlot(index, timeSlots);
            case 2:
                timeSlots = timeSlots.filter(timeSlot => timeSlot.weekDay === 'TUESDAY');
                return this.validateTimeSlot(index, timeSlots);
            case 3:
                timeSlots = timeSlots.filter(timeSlot => timeSlot.weekDay === 'WEDNESDAY');
                return this.validateTimeSlot(index, timeSlots);
            case 4:
                timeSlots = timeSlots.filter(timeSlot => timeSlot.weekDay === 'THURSDAY');
                return this.validateTimeSlot(index, timeSlots);
            case 5:
                timeSlots = timeSlots.filter(timeSlot => timeSlot.weekDay === 'FRIDAY');
                return this.validateTimeSlot(index, timeSlots);
            default:
                return true;
        }
    }

    validateTimeSlot = (index, timeSlots) => {
        timeSlots.sort((a, b) => a.id - b.id);
        for(let i = 0; timeSlots.length; i++) {
            if(i === index) return true;
        }
        this.setState({ 
            message: `Веремевият диапазон не е избран за този хорариум!`
        });
        return false;
    }

    render() {
        const { lessons, hoursTemplate } = this.props;
        const { message, show } = this.state;

        return(
            <div>
                <CustomAlert
                    open={show}
                    onClose={() => this.setState({ show: false })}
                    alertText={message}
                    variant="error"
                />
                <DragDropContext onDragEnd={this.handleOnDragEnd.bind(this)}>
                    <Droppable droppableId="0" type="droppableItem">
                        {((provided, snapshot) => (
                            <Paper 
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="
                                myDefaultMinWidth
                                paperRow"
                                style={getListStyle(snapshot.isDraggingOver)}
                            >
                                {lessons[0] && lessons[0].items.length === 0 && 
                                    <h3 className="myFontFamily">Няма останали хорариуми</h3>
                                }
                                {lessons[0] && 
                                <LessonSlot 
                                    day={lessons[0]} 
                                    slots={hoursTemplate}
                                    weekDay={0}
                                />}
                                {provided.placeholder}
                            </Paper>
                        ))}
                    </Droppable>
                    <div className="myDefaultMarginTopBottom">
                        <Paper className="paperRow">
                        {Object.entries(lessons).slice(1).map(([columnId, lesson], index) => (
                            <div key={columnId}>
                                <div className="myTextAlignCenter">
                                    <h2 className="myFontFamily">{lesson.name}</h2>
                                </div>
                                <div className="myDefaultMargin listPaper">
                                    <Droppable droppableId={columnId} type="droppableItem">
                                        {(provided, snapshot) => (
                                            <List
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                className="
                                                boxShadow
                                                myDefaultPadding 
                                                myDefaultMinHeight
                                                myDefaultMinWidth"
                                                style={getListStyle(snapshot.isDraggingOver)}
                                            >
                                                <LessonSlot
                                                    day={lesson} 
                                                    slots={hoursTemplate}
                                                    weekDay={index + 1}
                                                />
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
        )
    }
}