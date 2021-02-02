import React, { Component } from 'react';
import ReactToPrint, { PrintContextConsumer } from 'react-to-print';
import PrintIcon from '@material-ui/icons/Print';
import { IconButton } from '@material-ui/core';
import { CardSlot } from './listItems';

class ComponentToPrint extends Component {
    render() {
        const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        const slots = [0, 1, 2, 3, 4, 5, 6, 7];
        const { lessons } = this.props;

        return(
            <table>
                <thead>
                    <tr>
                        {weekDays.map((weekDay, index) => (
                            <th key={index}>{weekDay}</th>
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
                                                        <div key={index}>
                                                            <p>{item.teachingHour.subject.name}</p>
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