import React, { Component } from 'react';
import { Container, Button } from 'react-bootstrap';
import cabinetCategoryService from '../../services/schedule/cabinet/cabinet-category.service';
import cabinetService from '../../services/schedule/cabinet/cabinet.service';
import ModelInput from '../shared/model-input.component';
import { Link } from 'react-router-dom';
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
        cabinetService.getAllCabinetsByScheduleId(this.state.schedule.id)
        .then(result => {
            this.setState({ cabinets: result.data });
        })
        .catch(error => {
            console.error(error);
        });

        cabinetCategoryService.getDefaultCabinetCategories()
        .then(result => {
            let categories = result.data;
            this.setState({ categories });
            cabinetCategoryService.getAllCabinetCategoriesByScheduleId(this.state.schedule.id)
            .then(result => {
                this.setState({ categories: categories.concat(result.data) });
            });
        })
        .catch(error => {
            console.error(error);
        });
    }
    

    render() {

        const { cabinets, categories } = this.state;

        return(
            <>
                <Container>
                    <ModelInput type="cabinet" categories={categories} elements={cabinets} service={cabinetService}/>
                </Container>
                <Link to={"/teaching-hour-management"}>
                    <Button
                        className="btn-block"
                    >
                        Напред
                    </Button>
                </Link>
            </>
        );
    }
}