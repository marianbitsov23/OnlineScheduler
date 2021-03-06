import React from 'react';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { Button } from '@material-ui/core';

export const SaveButton = ({ fullWidth, text, onClick, disabled }) => (
    <Button
        fullWidth={fullWidth}
        className="save"
        variant="contained"
        onClick={onClick}
        disabled={disabled}
    >
        {text} <CheckCircleIcon />
    </Button>
);