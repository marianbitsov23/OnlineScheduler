import React, { Component } from 'react';
import { Container, Button } from 'react-bootstrap';
import cabinetCategoryService from '../../services/schedule/cabinet/cabinet-category.service';
import cabinetService from '../../services/schedule/cabinet/cabinet.service';
import ModelInput from '../shared/model-input.component';

export default class CreateCabinet extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cabinets: [],
            categories: [],
        };
    }

    componentDidMount() {
        cabinetService.getAllCabinets()
        .then(result => {
            this.setState({ cabinets: result.data });
        })
        .catch(error => {
            console.error(error);
        })

        cabinetCategoryService.getAllCabinetCategories()
        .then(result => {
            this.setState({ categories: result.data });
        })
        .catch(error => {
            console.error(error);
        })
    }
    

    render() {

        const { cabinets, categories } = this.state;

        return(
            <>
                <Container>
                    <ModelInput type="cabinet" categories={categories} elements={cabinets} service={cabinetService}/>
                </Container>
                <Button
                    className="btn-block"
                >
                    Напред
                </Button>
            </>
        );
    }
}