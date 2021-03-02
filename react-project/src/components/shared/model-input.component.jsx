import React, { Component } from 'react';
import scheduleService from '../../services/schedule/schedule.service';
import TableList from '../shared/table.component';
import { Container, Typography, Paper } from '@material-ui/core';
import Form from "react-validation/build/form";
import CategorySelect from './category-select.component';
import { ConfirmButton } from './confirm-button.component';
import { TextInput } from './text-input.component';

export default class ModelInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            elementName: "",
            initials: "",
            loading: false,
            categories: [],
            schedule: scheduleService.getCurrentSchedule()
        };

    }

    onChange = event => {
        event.preventDefault();

        this.setState({ [event.target.name] : event.target.value });
    }

    createElement = event => {
        event.preventDefault();

        this.setState({ loading: true });

        const { elementName, schedule, initials, categories } = this.state;

        const service = this.props.service;

        //TODO: fix saving duplicate elements

        let element = undefined;

        switch(this.props.type) {
            case "subject": 
                element = { name: elementName, schedule: schedule };
                break;
            case "teacher":
                element = { name: elementName, initials: initials, schedule: schedule };
                break;
            case "cabinet":
                element = { name: elementName, 
                    categories: categories,
                    schedule: schedule
                };
                break;
            default:
                break;
        }

        service.create(element)
        .then(result => {
            this.props.elements.push(result.data);
            this.setState({ elementName: "", initials: "", loading: false });
        })
        .catch(error => console.error(error));
    }

    selectCategories = categories => {
        this.setState({ categories: categories });
    }

    render() {
        const { elementName } = this.state;
        const service = this.props.service;
        const disabled = elementName === "";

        return(
            <>
                <Container>
                    <Paper className="myDefaultPadding">
                        <Form onSubmit={this.createElement}>
                            {this.props.type === "teacher" &&
                                <Typography variant="h4" className="myTextAlignCenter">
                                    Добави нов учител
                                </Typography>
                            }
                            {this.props.type === "subject" &&
                                <Typography variant="h4" className="myTextAlignCenter">
                                    Добави нов предмет
                                </Typography>
                            }
                            {this.props.type === "cabinet" &&
                                <Typography variant="h4"className="myTextAlignCenter">
                                    Добави нов кабинет
                                </Typography>
                            }

                            <div className="myDefaultMargin">
                                <TextInput
                                    name="elementName"
                                    value={this.state.elementName}
                                    label=
                                        {(this.props.type === "teacher" && "Име на учителя")
                                        || (this.props.type === "subject" && "Име на предмета")
                                        || (this.props.type === "cabinet" && "Име на учебната зала")}
                                    onChange={this.onChange}
                                />
                            </div>

                            {this.props.type === "teacher" &&
                                <div className="myDefaultMargin">
                                    <TextInput
                                        name="initials"
                                        value={this.state.initials}
                                        label="Инициали"
                                        onChange={this.onChange}
                                    />
                                </div>
                            }

                            {this.props.type === "cabinet" && 
                                <CategorySelect 
                                    cabinetName={this.state.elementName} 
                                    schedule={this.state.schedule} 
                                    categories={this.props.categories} 
                                    selectCategories={this.selectCategories}
                                />
                            }

                            <ConfirmButton 
                                disabled={disabled}
                                loading={this.state.loading}
                                text="Добави"
                            />
                        </Form>
                    </Paper>
                </Container>
                <hr />
                <Container>
                    <TableList type={this.props.type} elements={this.props.elements} service={service} />
                </Container>
            </>
        );
    }
}