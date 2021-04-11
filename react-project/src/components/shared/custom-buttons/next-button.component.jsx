import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container } from '@material-ui/core';

export const NextButton = ({ type, link }) => (
    <Link to={link} className="noUnderLine">
        <Container>
            <Button 
                className="myDefaultMarginTopBottom"
                fullWidth
                variant="contained" 
                color="secondary"
            >
                {type === "forward" && 'Напред'}
                {type === "backwards" && 'Назад'}
            </Button>
        </Container>
    </Link>
)