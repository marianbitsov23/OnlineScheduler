import React, { Component } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Paper, List } from '@material-ui/core';
import { LessonSlot } from './listItems';

const primaryColor = "#2196F3";
const whiteColor = "#fafafa";

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? primaryColor : whiteColor,
    padding: '1rem',
    width: 200
});

export default class WeekDays extends Component {
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
                const items = lessons[destDay].items;
                const removedItem = items[destination.index];

                items[destination.index] = items[source.index];
                items[destination.index].slotIndex = destination.index;
                items[source.index] = removedItem;
                items[source.index].slotIndex = source.index;

                lessons[destination.droppableId].items = items;

                setLessons(lessons);
            }
        } else {
            const destItems = [...lessons[destDay].items];
            const sourceItems = [...lessons[sourceDay].items];
            
            if (result.type === "droppableSubItem") {
                if(destination.index > 1) return;
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
                const removedItem = destItems[destination.index];

                destItems[destination.index] = sourceItems[source.index];
                destItems[destination.index].slotIndex = destination.index;
                sourceItems[source.index] = removedItem;
                if(sourceItems[source.index]) {
                    sourceItems[source.index].slotIndex = source.index;
                    sourceItems[source.index].weekDay = parseInt(source.droppableId);
                }
                destItems[destination.index].weekDay = parseInt(destination.droppableId);

                if(this.validateLesson(
                    sourceItems[source.index], destItems[destination.index]
                )) {
                    lessons[destination.droppableId].items = destItems;
                    lessons[source.droppableId].items = sourceItems;
        
                    setLessons(lessons);
                } else {
                    console.log('error')
                }
            }
        }
    }

    validateLesson = (sourceLesson, destLesson) => {
        if(destLesson === undefined) return false;
        if((sourceLesson.teachingHour === undefined ||
        this.validateTimeSpan(
            sourceLesson.teachingHour.timeSlots,
            sourceLesson.slotIndex    
        )) && this.validateTimeSpan(
            destLesson.teachingHour.timeSlots,
            destLesson.slotIndex
        )) {
            return true;
        }

        return false;
    }

    validateTimeSpan = (timeSlots, index) => {
        for(let i = 0; i < timeSlots.length; i++) {
            const timeSlotIndex = this.determineTimeSpan(
                timeSlots[i].timeStart, timeSlots[i].timeEnd
            );
            if(timeSlotIndex === index) return true;
        }
        return false;
    }

    determineTimeSpan = (timeStart, timeEnd) => {
        switch (timeStart + ' - ' + timeEnd) {
            case "8:00 - 8:40": return 0;
            case "8:50 - 9:30": return 1;
            case "9:40 - 10:20": return 2;
            case "10:50 - 11:40": return 3;
            case "11:50 - 12:30": return 4;
            case "12:40 - 13:20": return 5;
            case "13:30 - 14:10": return 6;
            default: return -1;
            //vtora smqna
        }
    }

    render() {
        const { lessons, hoursTemplate } = this.props;

        return(
            <>
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
                                    <h3 className="myFontFamily">Nothing left here</h3>
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
            </>
        )
    }
}