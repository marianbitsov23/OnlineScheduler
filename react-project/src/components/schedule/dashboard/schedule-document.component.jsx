import React, { Component } from 'react';
import ReactToPrint, { PrintContextConsumer } from 'react-to-print';
import PrintIcon from '@material-ui/icons/Print';
import { IconButton } from '@material-ui/core';

class ComponentToPrint extends Component {
    render() {
        const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        const slots = [0, 1, 2, 3, 4, 5, 6, 7];
        const { lessons } = this.props;

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
                                        <>
                                            {column.items.map((item, index) => {
                                                if(item.weekDay === dayNumber + 1 && item.slotIndex === slot) {
                                                    return(
                                                        <div className="myDisplayFlex" key={index}>
                                                            <div className="space slotNumber">
                                                                {index + 1}
                                                            </div>
                                                            <div className="space timeDuration">
                                                                {index === 0 && <>8:00 - 8:40</>}
                                                                {index === 1 && <>8:50 - 9:30</>}
                                                                {index === 2 && <>9:40 - 10:20</>}
                                                                {index === 3 && <>10:50 - 11:40</>}
                                                                {index === 4 && <>11:50 - 12:30</>}
                                                                {index === 5 && <>12:40 - 13:20</>}
                                                                {index === 6 && <>13:30 - 14:10</>}
                                                            </div>
                                                            <div className="space subject">
                                                                {item.teachingHour.subject.name}
                                                            </div>
                                                            <div className="space cabinet">
                                                                {item.teachingHour.cabinet.name}
                                                            </div>
                                                            <div className="space initials">
                                                                {item.teachingHour.teacher.initials}
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            })}
                                        </>
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
                    <ComponentToPrint lessons={this.props.lessons} ref={el => (this.componentRef = el)} />
                </div>
            </>
        );
    }
}