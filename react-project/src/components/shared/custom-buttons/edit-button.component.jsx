import React from 'react';
import EditIcon from '@material-ui/icons/Edit';
import { Button } from '@material-ui/core';

export const EditButton = ({ fullWidth, text, onClick, disabled }) => (
    <Button
        fullWidth={fullWidth}
        className="edit"
        variant="contained"
        onClick={onClick}
        disabled={disabled}
    >
        {text} <EditIcon />
    </Button>
);