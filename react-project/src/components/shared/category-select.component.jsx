import React, { Component } from 'react';
import cabinetCategoryService from '../../services/schedule/cabinet/cabinet-category.service';
import { Button, Container, Typography, Paper } from '@material-ui/core';
import { CustomDialog } from './custom-dialog.component';
import { TextInput } from './text-input.component';
import { EditButton } from './custom-buttons/edit-button.component';
import { DeleteButton } from './custom-buttons/delete-button.component';

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

    createCategory = () => {
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
            <Container className="margin-bottom-16px">
            <div className="
                display-flex 
                align-items-center 
                justify-content-space-between
                margin-bottom-16px"
            >
                <Typography>
                    Изберете категория на кабинета
                </Typography>
                <EditButton
                    text="Добави нова категория"
                    onClick={() => this.setState({ show: !this.state.show})}
                />
            </div>
            <Paper style={{maxHeight: 300, overflow: 'auto'}}>
                <Container>
                    <div className="categories">
                    {(this.props.categories && this.props.categories.map(category => (
                        <CategoryItem
                            key={category.id}
                            name={category.name}
                            type={cabinetCategories.includes(category) ? "Премахни" : "Избери"}
                            selectCategory={cabinetCategories.includes(category) ?
                                this.handleSelect.bind(this, "remove", category) :
                                this.handleSelect.bind(this, "add", category)}
                            deleteCategory={this.deleteCategory.bind(this, category)}
                            schedule={category.schedule}
                            color={cabinetCategories.includes(category) ? "secondary" : "primary"}
                        />
                    )))}
                    </div>
                    <CustomDialog 
                        show={show}
                        onClose={() => this.setState({ show: !show })}
                        title="Добави нова категория"
                        text="Категорията, която ще добавите съществува само и единствено в контекста на текущия график!"
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
            </Paper>
            </Container>
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
                variant="contained"
                className="margin-right-16px"
                color={color}
                onClick={selectCategory}
            >
                {type}
            </Button>
            {schedule &&
            <div className="margin-right-16px">
                <DeleteButton 
                    onClick={deleteCategory}
                    text="Изтриване"
                />
            </div>
            }
        </div>
    </div>
)