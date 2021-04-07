import React, { Component } from 'react';
import ReactToPrint, { PrintContextConsumer } from 'react-to-print';
import PrintIcon from '@material-ui/icons/Print';
import { IconButton } from '@material-ui/core';

class ComponentToPrint extends Component {
    render() {
        const weekDays = ['Понеделник', 'Вторник', 'Сряда', 'Четвъртък', 'Петък'];
        const slots = [0, 1, 2, 3, 4, 5, 6, 7];
        const { lessons, timeTable } = this.props;
        let secondShift = true;

        if(timeTable && timeTable.timeSlots[0].timeStart === "8:00") secondShift = false

        return(
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
                                                 item.slotIndex === slot && item.teachingHour &&
                                                        <div className="myDisplayFlex" key={index}>
                                                            <div className="slotNumber">
                                                                {index + 1}
                                                            </div>
                                                            <div>
                                                                {index === 0 && <>
                                                                    {!secondShift && <> 8:00 - 8:40</>}
                                                                    {secondShift && <> 13:00 - 13:40</>}
                                                                </>}
                                                                {index === 1 && <>
                                                                    {!secondShift && <> 8:50 - 9:30</>}
                                                                    {secondShift && <> 13:50 - 14:30</>}
                                                                </>}
                                                                {index === 2 && <>
                                                                    {!secondShift && <> 9:40 - 10:20</>}
                                                                    {secondShift && <> 14:40 - 15:20</>}
                                                                </>}
                                                                {index === 3 && <>
                                                                    {!secondShift && <> 10:50 - 11:30</>}
                                                                    {secondShift && <> 15:50 - 16:30</>}
                                                                </>}
                                                                {index === 4 && <>
                                                                    {!secondShift && <> 11:50 - 12:30</>}
                                                                    {secondShift && <> 16:50 - 17:30</>}
                                                                </>}
                                                                {index === 5 && <>
                                                                    {!secondShift && <> 12:40 - 13:20</>}
                                                                    {secondShift && <> 17:40- 18:20</>}
                                                                </>}
                                                                {index === 6 && <>
                                                                    {!secondShift && <> 13:20 - 14:10</>}
                                                                    {secondShift && <> 18:30 - 19:10</>}
                                                                </>}
                                                            </div>
                                                            {item.teachingHour.overAWeek &&
                                                            <div className="space overAWeek">
                                                                {item.subItems[0].teachingHour && item.subItems[0].teachingHour.subject &&
                                                                <>{item.subItems[0].teachingHour.subject.name} - чет.седм. </>} 
                                                                /
                                                                {item.subItems[1].teachingHour && item.subItems[1].teachingHour.subject &&
                                                                <>{item.subItems[1].teachingHour.subject.name} - нечет.седм. </>} 
                                                            </div>}
                                                            {!item.teachingHour.overAWeek &&
                                                            <div className="space subject">
                                                                {item.teachingHour.subject.name}
                                                            </div>}
                                                            <div className="space cabinet">
                                                                {item.teachingHour.cabinet.name}
                                                            </div>
                                                            <div className="space initials">
                                                                {item.teachingHour.teacher.initials}
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