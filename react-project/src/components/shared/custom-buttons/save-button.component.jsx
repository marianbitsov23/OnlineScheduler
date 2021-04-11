import React from 'react';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { Button } from '@material-ui/core';

export const SaveButton = ({ text, onClick, disabled }) => (
    <Button
        className="save"
        variant="contained"
        onClick={onClick}
        disabled={disabled}
    >
        {text} <CheckCircleIcon />
    </Button>
);