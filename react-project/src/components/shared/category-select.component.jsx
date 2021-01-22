import React, { Component } from 'react';
import { Container, Modal, FormGroup, Button, Col, Row } from 'react-bootstrap';
import FormBootstrap from 'react-bootstrap/Form';
import Input from "react-validation/build/input";
import cabinetCategoryService from '../../services/schedule/cabinet/cabinet-category.service';

export default class CategorySelect extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false,
            categoryName: "",
            cabinetCategories: []
        };

        this.createCategory.bind(this);
    }

    createCategory = event => {
        event.preventDefault();

        const { categoryName } = this.state;

        cabinetCategoryService.createCabinetCategory(categoryName, this.props.schedule)
        .then(result => {
            this.props.categories.push(result.data);
            this.setState({ categoryName: "", show: false });
        })
        .catch(error => {
            console.error(error);
        })
    }

    handleSelect = (type, category) => {
        let newCategories = this.state.cabinetCategories;

        if(type === "add") {
            newCategories.push(category);
            this.props.selectCategories(newCategories);
            this.setState({ cabinetCategories: newCategories });
        } else {
            newCategories.splice(newCategories.indexOf(category), 1);
            this.props.selectCategories(newCategories);
            this.setState({ cabinetCategories: newCategories });
        }
    }

    deleteCategory = category => {
        cabinetCategoryService.deleteCabinetCategory(category.id)
        .then(() => {
            let categories = this.props.categories;
            categories.splice(categories.indexOf(category), 1);
            this.props.selectCategories(categories);
        })
        .catch(error => {
            console.error(error);
        })
    }

    onChange = event => {
        event.preventDefault();

        this.setState({ [event.target.name] : event.target.value });
    }

    render() {

        const { cabinetCategories, show, categoryName } = this.state;

        return(
            <FormGroup>
                <Container>
                    <FormBootstrap.Label htmlFor="subjects">
                        Изберете категория на кабинета
                    </FormBootstrap.Label>
                </Container>
                {(this.props.categories && this.props.categories.map(category => {
                    if(cabinetCategories.includes(category)) {
                        return (
                            <Row className="justify-content-md-center " key={category.id}>
                            <Col>
                                {category.name}
                            </Col>
                            <Col>
                                <Button
                                        variant="outline-danger"
                                        onClick={this.handleSelect.bind(this, "remove", category)}
                                    >Премахни</Button>
                            </Col>
                            {category.schedule &&
                            <Col>
                                <Button
                                variant="outline-danger"
                                onClick={this.deleteCategory.bind(this, category)}
                                >Изтрий</Button>
                            </Col>
                            }
                        </Row>
                        )
                    } else {
                        return(
                            <Row className="justify-content-md-center " key={category.id}>
                                <Col>
                                    {category.name}
                                </Col>
                                <Col>
                                    <Button
                                        variant="outline-info"
                                        onClick={this.handleSelect.bind(this, "add", category)}
                                    >Избери</Button>
                                </Col>
                                {category.schedule &&
                                <Col>
                                    <Button
                                    variant="outline-danger"
                                    onClick={this.deleteCategory.bind(this, category)}
                                    >Изтрий</Button>
                                </Col>
                                }
                            </Row>
                        )
                    }
                }))}
                <Container>
                    <Button onClick={() => this.setState({ show: !this.state.show})}>
                        Добави нова категория
                    </Button>
                </Container>
                <Modal 
                show={show}
                onHide={() => this.setState({ show: !show })}
                centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Доабви нова категория</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        
                            <FormGroup>
                                <Input
                                    type="text"
                                    className="form-control"
                                    name="categoryName"
                                    value={categoryName}
                                    onChange={this.onChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Button
                                    onClick={this.createCategory}
                                    variant="success"
                                    className="btn-block">
                                        {this.state.loading &&
                                            <span className="spinner-border spinner-border-sm"></span>
                                        }
                                        <span>Добави</span>
                                    </Button>
                            </FormGroup>
                    </Modal.Body>
                </Modal>
            </FormGroup>
        );
    }
}