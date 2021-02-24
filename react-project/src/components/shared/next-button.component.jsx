import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container } from '@material-ui/core';

export const NextButton = ({ link }) => (
    <Link to={link} className="noUnderLine">
        <Container>
            <Button 
                className="myDefaultMarginTopBottom"
                fullWidth
                variant="contained" 
                color="secondary"
            >
                Напред
            </Button>
        </Container>
    </Link>
)