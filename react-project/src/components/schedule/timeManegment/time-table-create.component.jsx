import React, { Component } from 'react';


export default class CreateTimeTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timeTableName: "",
            slots: []
        };
    }

    componentDidMount() {

    }

    render() {

        return(
            <>
                <Container>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Monday</th>
                                <th>Tuesday</th>
                                <th>Wednesday</th>
                                <th>Thursday</th>
                                <th>Friday</th>
                            </tr>
                        </thead>
                        <tbody>
                            
                            <tr>

                            </tr>
                        </tbody>
                    </Table>
                </Container>
            </>
        )
    }
}