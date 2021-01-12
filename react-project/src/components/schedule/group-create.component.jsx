import React, { Component } from 'react';
import { Container, Card, FormGroup, Button, Row, Col, Modal } from 'react-bootstrap';
import FormBootstrap from 'react-bootstrap/Form';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import groupService from '../../services/schedule/group.service';
import scheduleService from '../../services/schedule/schedule.service';
import { AiOutlinePlus } from 'react-icons/ai';


export default class CreateGroup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            groupName: "",
            groups: [],
            parent: {},
            groupRows: 2,
            schedule: scheduleService.getCurrentSchedule(),
            show: false
        };

        this.addGroup.bind(this);
        this.saveGroups.bind(this);
        this.onShow.bind(this);
        this.onHide.bind(this);
    }

    componentDidMount() {
        // load already created groups for this schedule
        groupService.getGroupById(this.state.schedule.parentGroup.id)
        .then(result => {
            console.log(result.data);
        })
        .catch(error => {
            console.error(error);
        })
    }

    addGroup = event => {
        event.preventDefault();
        const { groupName, parent, schedule, groups } = this.state; 

        groupService.createGroup(parent, groupName, null, schedule)
        .then(result => {
            groups.push(result.data);
        })
        .catch(error => {
            console.error(error);
        })
    }

    saveGroups = event => {
        event.preventDefault();
    }

    onChange = event => {
        this.setState({ [event.target.name] : event.target.value });
    }

    onShow(parent, event) {
        this.setState({ show: !this.state.show, parent });
    }

    onHide = event => {
        this.setState({ show: false, parent: null });
    }

    render() {
        const { groupName, groups, schedule, show } = this.state;

        const isInvalid = groupName === "";

        return(
            <>
                <Container>
                    <Card>
                        <Card.Header>Create groups</Card.Header>
                        <Card.Body>
                            <Row className="justify-content-md-center">
                                <Col xs lg="2">
                                    <Button variant="info">
                                        {schedule.parentGroup.groupName}
                                    </Button>
                                </Col>
                            </Row>
                            <Row className="justify-content-md-center">
                                <Col xs lg="2">
                                    <Button variant="info">
                                        {schedule.parentGroup.groupName}
                                    </Button>
                                </Col>
                                <Col xs lg="2">
                                    <Button variant="info">
                                        {schedule.parentGroup.groupName}
                                    </Button>
                                </Col>
                                <Col xs lg="2">
                                    <Button variant="info">
                                        {schedule.parentGroup.groupName}
                                    </Button>
                                </Col>
                                <Col xs lg="2">
                                    <Button variant="info">
                                        {schedule.parentGroup.groupName}
                                    </Button>
                                </Col>
                                
                            </Row>
                            <Row>
                                {groups && groups.map(group => (
                                    <Col xs lg="2">
                                        <Button variant="info">
                                            {group.groupName}
                                        </Button>
                                    </Col>
                                ))}
                                <Button
                                onClick={this.onShow.bind(this, schedule.parentGroup)}>
                                    <AiOutlinePlus />
                                </Button>
                            </Row>
                            <Modal 
                            show={show} 
                            onHide={this.onHide}
                            centered
                            >
                                <Modal.Header closeButton>
                                    <Modal.Title>Enter a name for the group</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form
                                    onSubmit={this.addGroup}
                                    ref={c => {
                                        this.form = c;
                                    }}
                                    >
                                        <FormGroup>
                                            <FormBootstrap.Label htmlFor="cabinetName">Group name</FormBootstrap.Label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                name="groupName"
                                                value={this.state.groupName}
                                                onChange={this.onChange}
                                            />
                                        </FormGroup>

                                        
                                        <FormGroup>
                                            <Button
                                                type="submit"
                                                variant="primary"
                                                className="btn-block"
                                                disabled={isInvalid}>
                                                    {this.state.loading &&
                                                        <span className="spinner-border spinner-border-sm"></span>
                                                    }
                                                    <span>Add group</span>
                                                </Button>
                                        </FormGroup>
                                    </Form>
                                </Modal.Body>
                            </Modal>
                        </Card.Body>
                    </Card>
                </Container>
            </>
        );
    }
}