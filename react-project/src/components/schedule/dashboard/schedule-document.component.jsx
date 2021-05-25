import React, { Component } from 'react';
import ReactToPrint, { PrintContextConsumer } from 'react-to-print';
import PrintIcon from '@material-ui/icons/Print';
import { IconButton } from '@material-ui/core';

class ComponentToPrint extends Component {
    render() {
        const weekDays = ['Понеделник', 'Вторник', 'Сряда', 'Четвъртък', 'Петък'];
        const slots = [0, 1, 2, 3, 4, 5, 6, 7];
        const { lessons } = this.props;

        return(
            <>
            <table className="document">
                <thead>
                    <tr>
                        {weekDays.map((weekDay, index) => (
                            <th className="myTextAlignCenter" key={index}>{weekDay}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {slots.map(slot => (
                        <tr key={slot}>
                            {weekDays.map((weekDay, dayNumber) => (
                                <td key={dayNumber}>
                                    {Object.entries(lessons).slice(1).map(([columnId, column]) => (
                                        <div key={columnId}>
                                            {column.items.map((item, index) => (
                                                <div key={index}>
                                                {item && item.weekDay === dayNumber + 1 &&
                                                 item.slotIndex === slot && 
                                                 (item.teachingHour || item.subItems[0] || item.subItems[1]) &&
                                                        <div className="myDisplayFlex" key={index}>
                                                            <div className="slotNumber">
                                                                {index + 1}
                                                            </div>
                                                            <div>
                                                                {item.timeStart} - {item.timeEnd}
                                                            </div>
                                                            {(item.subItems[0] || item.subItems[1]) &&
                                                            <div className="space overAWeek">
                                                                {item.subItems[0].teachingHour && item.subItems[0].teachingHour.subject &&
                                                                <>{item.subItems[0].teachingHour.subject.name} - чет.седм. </>} 
                                                                /
                                                                {item.subItems[1].teachingHour && item.subItems[1].teachingHour.subject &&
                                                                <>{item.subItems[1].teachingHour.subject.name} - нечет.седм. </>} 
                                                            </div>}
                                                            {!(item.subItems[0] || item.subItems[1]) &&
                                                            <div className="space subject">
                                                                {item.teachingHour.subject.name}
                                                            </div>}
                                                            <div className="space cabinet">
                                                                {item.teachingHour && item.teachingHour.cabinet.name}
                                                            </div>
                                                            <div className="space initials">
                                                                {item.teachingHour && item.teachingHour.teacher.name}
                                                            </div>
                                                        </div>}
                                                </div>
                                                )
                                            )}
                                        </div>
                                    ))}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            </>
        );
    }
}

export default class SchedulePrint extends Component {
    render() {
        return(
            <>
                <ReactToPrint content={() => this.componentRef}>
                    <PrintContextConsumer>
                        {({ handlePrint }) => (
                            <IconButton onClick={handlePrint} color="inherit">
                                <PrintIcon />
                            </IconButton>
                        )}
                    </PrintContextConsumer>
                </ReactToPrint>
                <div className="myHidden">
                    <ComponentToPrint 
                        timeTable={this.props.timeTable}
                        lessons={this.props.lessons} 
                        ref={el => (this.componentRef = el)} 
                    />
                </div>
            </>
        );
    }
}