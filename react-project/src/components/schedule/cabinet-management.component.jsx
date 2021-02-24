import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import cabinetCategoryService from '../../services/schedule/cabinet/cabinet-category.service';
import cabinetService from '../../services/schedule/cabinet/cabinet.service';
import ModelInput from '../shared/model-input.component';
import { NextButton } from '../shared/next-button.component';
import scheduleService from '../../services/schedule/schedule.service';

export default class ManageCabinets extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cabinets: [],
            categories: [],
            schedule: scheduleService.getCurrentSchedule()
        };
    }

    componentDidMount() {
        cabinetService.getAllByScheduleId(this.state.schedule.id)
        .then(result => {
            this.setState({ cabinets: result.data });
        })
        .catch(error => console.error(error));

        cabinetCategoryService.getDefaultCabinetCategories()
        .then(result => {
            let categories = result.data;
            this.setState({ categories });
            cabinetCategoryService.getAllByScheduleId(this.state.schedule.id)
            .then(result => {
                this.setState({ categories: categories.concat(result.data) });
            });
        })
        .catch(error => console.error(error));
    }
    

    render() {

        const { cabinets, categories } = this.state;

        return(
            <Container>
                <ModelInput type="cabinet" categories={categories} elements={cabinets} service={cabinetService}/>
                <NextButton link={"/teaching-hour-management"}/>
            </Container>
        );
    }
}