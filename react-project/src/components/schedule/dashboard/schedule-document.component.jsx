import React, { Component } from 'react';
import ReactToPrint, { PrintContextConsumer } from 'react-to-print';
import PrintIcon from '@material-ui/icons/Print';
import { IconButton } from '@material-ui/core';
import { CardSlot } from './listItems';

class ComponentToPrint extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
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
                    {Object.entries(lessons).slice(1).map(([columnId, column], index) => (
                        <tr key={columnId}>
                            {column.items.map(item => (
                                <td>{item.id}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }
}

export default class SchedulePrint extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        console.log(this.props.lessons);

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