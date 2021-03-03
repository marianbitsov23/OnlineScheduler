import React, { Component } from 'react';
import cabinetCategoryService from '../../services/schedule/cabinet/cabinet-category.service';
import { Button, Container, Typography } from '@material-ui/core';
import { CustomDialog } from './custom-dialog.component';
import { TextInput } from './text-input.component';

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

        cabinetCategoryService.create({name: categoryName, schedule: this.props.schedule})
        .then(result => {
            this.props.categories.push(result.data);
            this.setState({ categoryName: "", show: false });
        })
        .catch(error => console.error(error))
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
        .catch(error => console.error(error))
    }

    onChange = event => this.setState({ [event.target.name] : event.target.value });

    render() {

        const { cabinetCategories, show } = this.state;

        return(
            <>
            <Container className="myDefaultPadding">
                <Typography>
                    Изберете категория на кабинета
                </Typography>
                <div className="categories">
                {(this.props.categories && this.props.categories.map(category => {
                    if(cabinetCategories.includes(category)) {
                        return (
                            <CategoryItem
                                name={category.name}
                                type="Премахни"
                                selectCategory={this.handleSelect.bind(this, "remove", category)}
                                deleteCategory={this.deleteCategory.bind(this, category)}
                                schedule={category.schedule}
                                color="secondary"
                            />
                        )
                    } else {
                        return(
                            <CategoryItem
                                name={category.name}
                                type="Избери"
                                selectCategory={this.handleSelect.bind(this, "add", category)}
                                deleteCategory={this.deleteCategory.bind(this, category)}
                                schedule={category.schedule}
                                color="primary"
                            />
                        )
                    }
                }))}
                </div>
                <Container>
                    <Button onClick={() => this.setState({ show: !this.state.show})}>
                        Добави нова категория
                    </Button>
                </Container>
                <CustomDialog 
                    show={show}
                    onClose={() => this.setState({ show: !show })}
                    title="Добави нова категория"
                    confirmFunction={this.createCategory}
                    confirmButtonText="Добави"
                    content={
                        <TextInput 
                            name="categoryName"
                            value={this.state.categoryName}
                            label="Въведете името на категорията"
                            type="text"
                            onChange={this.onChange}
                        />
                    }
                />
            </Container>
            </>
        );
    }
}


const CategoryItem = ({ name, type, selectCategory, 
                        deleteCategory, schedule, 
                        color }) => (
    <div className="category">
        <div>
            <Typography>
                {name}
            </Typography>
        </div>
        <div className="categoryButtons">
            <Button 
                variant="outlined" 
                color={color}
                onClick={selectCategory}
            >
                {type}
            </Button>
            {schedule &&
                <Button onClick={deleteCategory}>
                    Изтрий
                </Button>
            }
        </div>
    </div>
)